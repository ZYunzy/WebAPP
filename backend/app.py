import os
import json
import copy
import atexit
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

USE_GCP_BACKEND = os.getenv("USE_GCP_BACKEND", "").lower() == "true"

if USE_GCP_BACKEND:
    try:
        from google.cloud import storage
        from google.cloud.sql.connector import Connector, IPTypes
        import sqlalchemy
        from sqlalchemy import text
    except ImportError as exc:
        raise RuntimeError("启用 USE_GCP_BACKEND 时需要安装 google-cloud-storage、sqlalchemy、pg8000 等依赖") from exc
else:
    storage = None
    Connector = None
    IPTypes = None
    sqlalchemy = None
    text = None

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

DEFAULT_BOUNDARY = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {"name": "校园边界", "area": "Campus Boundary"},
        "geometry": {"type": "Polygon", "coordinates": [[
            [-105.270, 40.010], [-105.260, 40.010], [-105.260, 40.005],
            [-105.270, 40.005], [-105.270, 40.010]
        ]]}
    }]
}
DEFAULT_BUILDINGS = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {"name": "图书馆", "type": "Library", "capacity": 500},
            "geometry": {"type": "Polygon", "coordinates": [[
                [-105.266, 40.008], [-105.265, 40.008],
                [-105.265, 40.007], [-105.266, 40.007],
                [-105.266, 40.008]
            ]]}
        },
        {
            "type": "Feature",
            "properties": {"name": "教学楼A", "type": "Academic Building", "capacity": 300},
            "geometry": {"type": "Polygon", "coordinates": [[
                [-105.268, 40.009], [-105.267, 40.009],
                [-105.267, 40.008], [-105.268, 40.008],
                [-105.268, 40.009]
            ]]}
        }
    ]
}
DEFAULT_COUNTRIES = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {"name": "Colorado", "country": "USA", "population": "5.8M"},
            "geometry": {"type": "Polygon", "coordinates": [[
                [-109.05, 41.00], [-102.04, 41.00],
                [-102.04, 37.00], [-109.05, 37.00],
                [-109.05, 41.00]
            ]]}
        },
        {
            "type": "Feature",
            "properties": {"name": "Wyoming", "country": "USA", "population": "0.6M"},
            "geometry": {"type": "Polygon", "coordinates": [[
                [-111.05, 45.00], [-104.05, 45.00],
                [-104.05, 41.00], [-111.05, 41.00],
                [-111.05, 45.00]
            ]]}
        }
    ]
}
DEFAULT_USER_POINTS = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {"id": 1, "notes": "绝佳学习地点"},
        "geometry": {"type": "Point", "coordinates": [-105.2655, 40.0075]}
    }]
}

def load_local_dataset(filename: str, fallback: dict) -> dict:
    path = PROJECT_ROOT / filename
    if path.exists():
        with path.open("r", encoding="utf-8") as fp:
            return json.load(fp)
    return copy.deepcopy(fallback)

LOCAL_BOUNDARY = load_local_dataset("boundary.geojson", DEFAULT_BOUNDARY)
LOCAL_BUILDINGS = load_local_dataset("buildings.geojson", DEFAULT_BUILDINGS)
LOCAL_COUNTRIES = load_local_dataset("countries.geojson", DEFAULT_COUNTRIES)
LOCAL_USER_POINTS = load_local_dataset("user_points.geojson", DEFAULT_USER_POINTS)

def save_local_user_points():
    path = PROJECT_ROOT / "user_points.geojson"
    with path.open("w", encoding="utf-8") as fp:
        json.dump(LOCAL_USER_POINTS, fp, ensure_ascii=False, indent=2)

storage_client = None
connector = None
db_engine = None
GCS_BUCKET_NAME = None

if USE_GCP_BACKEND:
    def require_env(name: str) -> str:
        value = os.getenv(name)
        if not value:
            raise RuntimeError(f"必须设置环境变量 {name} 才能启用 GCP 后端")
        return value

    PROJECT_ID = require_env("GCP_PROJECT_ID")
    REGION = require_env("CLOUD_SQL_REGION")
    INSTANCE_NAME = require_env("CLOUD_SQL_INSTANCE")
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASS = require_env("DB_PASSWORD")
    DB_NAME = os.getenv("DB_NAME", "postgres")
    GCS_BUCKET_NAME = require_env("GCS_BUCKET_NAME")

    storage_client = storage.Client(project=PROJECT_ID)
    connector = Connector()

    def get_conn():
        return connector.connect(
            f"{PROJECT_ID}:{REGION}:{INSTANCE_NAME}",
            "pg8000",
            user=DB_USER,
            password=DB_PASS,
            db=DB_NAME,
            ip_type=IPTypes.PRIVATE
        )

    db_engine = sqlalchemy.create_engine(
        "postgresql+pg8000://",
        creator=get_conn,
        pool_pre_ping=True,
    )

    atexit.register(connector.close)

app = Flask(__name__, static_folder='..', static_url_path='')
CORS(app, resources={r"/api/*": {"origins": "*"}})

def fetch_geojson_from_gcs(blob_name: str):
    try:
        bucket = storage_client.bucket(GCS_BUCKET_NAME)
        blob = bucket.blob(blob_name)
        content = blob.download_as_text(encoding="utf-8")
        return jsonify(json.loads(content))
    except Exception as exc:
        app.logger.exception("无法从 GCS 获取 %s: %s", blob_name, exc)
        return jsonify({"error": f"Failed to fetch {blob_name} from storage"}), 500

def respond_with_geojson(local_dataset: dict, blob_name: str):
    if USE_GCP_BACKEND:
        return fetch_geojson_from_gcs(blob_name)
    return jsonify(local_dataset)

@app.route("/api/health")
def health_check():
    return jsonify({"status": "healthy", "mode": "gcp" if USE_GCP_BACKEND else "local"})

@app.route("/api/boundary")
def boundary():
    return respond_with_geojson(LOCAL_BOUNDARY, "boundary.geojson")

@app.route("/api/buildings")
def buildings():
    return respond_with_geojson(LOCAL_BUILDINGS, "buildings.geojson")

@app.route("/api/countries")
def countries():
    return respond_with_geojson(LOCAL_COUNTRIES, "countries.geojson")

@app.route("/api/user-points", methods=["GET"])
def list_user_points():
    if USE_GCP_BACKEND:
        features = []
        try:
            with db_engine.connect() as conn:
                stmt = text("SELECT id, notes, ST_AsGeoJSON(location) AS location FROM user_points ORDER BY id")
                for row in conn.execute(stmt):
                    features.append({
                        "type": "Feature",
                        "geometry": json.loads(row.location),
                        "properties": {"id": row.id, "notes": row.notes}
                    })
            return jsonify({"type": "FeatureCollection", "features": features})
        except Exception as exc:
            app.logger.exception("查询用户兴趣点失败: %s", exc)
            return jsonify({"error": "Database query failed"}), 500
    return jsonify(LOCAL_USER_POINTS)

@app.route("/api/user-points", methods=["POST"])
def create_user_point():
    payload = request.get_json(silent=True) or {}
    notes = payload.get("notes", "")
    lat = payload.get("lat")
    lon = payload.get("lon")

    if lat is None or lon is None:
        return jsonify({"error": "lat 与 lon 为必填字段"}), 400

    if USE_GCP_BACKEND:
        try:
            with db_engine.connect() as conn:
                stmt = text(
                    "INSERT INTO user_points (notes, location) "
                    "VALUES (:notes, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)) "
                    "RETURNING id"
                )
                with conn.begin():
                    result = conn.execute(stmt, {"notes": notes, "lon": lon, "lat": lat})
                    new_id = result.scalar()
            return jsonify({"message": "Point added successfully", "id": new_id}), 201
        except Exception as exc:
            app.logger.exception("插入用户兴趣点失败: %s", exc)
            return jsonify({"error": "Database insert failed"}), 500

    global LOCAL_USER_POINTS
    new_id = max((feature["properties"].get("id", 0) for feature in LOCAL_USER_POINTS["features"]), default=0) + 1
    new_feature = {
        "type": "Feature",
        "properties": {"id": new_id, "notes": notes},
        "geometry": {"type": "Point", "coordinates": [lon, lat]}
    }
    LOCAL_USER_POINTS["features"].append(new_feature)
    save_local_user_points()
    return jsonify({"message": "Point saved successfully", "id": new_id}), 201

@app.route("/")
def index():
    return send_from_directory(PROJECT_ROOT, "index.html")

@app.route("/<path:path>")
def static_proxy(path):
    return send_from_directory(PROJECT_ROOT, path)

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8080)),
        debug=not USE_GCP_BACKEND
    )