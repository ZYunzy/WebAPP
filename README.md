# Interactive Campus Map - 交互式地图系统

这是一个基于 Leaflet.js 前端和 Flask 后端的交互式地图网站原型。

## 系统架构

- **前端**: HTML, CSS, JavaScript with Leaflet.js
- **后端**: Python Flask (模拟 Cloud Run, Cloud SQL, GCS)

## 功能特性

### 前端功能
- ✅ 多底图切换（OpenStreetMap、Google卫星影像、Google地图）
- ✅ 多图层显示与控制
  - 范围边界图层
  - 建筑物图层
  - 国家图层
  - 用户兴趣点图层
- ✅ 图层开关控制
- ✅ 点击地图添加用户兴趣点
- ✅ 弹窗显示要素属性信息

### 后端API
- `GET /api/boundary` - 获取范围边界数据
- `GET /api/buildings` - 获取建筑物数据
- `GET /api/countries` - 获取国家数据
- `GET /api/user-points` - 获取用户兴趣点
- `POST /api/user-points` - 添加新的用户兴趣点
- `GET /api/health` - 健康检查

## 运行方式

### 方式一：静态前端（无需后端）
1. 直接在浏览器中打开 `index.html`
2. 编辑 `script.js`，设置 `USE_LOCAL_API = false`
3. 使用本地 GeoJSON 文件作为数据源

### 方式二：前端 + 后端API
1. **启动后端服务**：
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```
   后端将在 http://localhost:5000 运行

2. **配置前端**：
   编辑 `script.js`，设置 `USE_LOCAL_API = true`

3. **访问前端**：
   - 使用浏览器打开 `index.html`
   - 或使用 Live Server 等工具

## 项目结构

```
webapp/
├── index.html              # 主页面
├── style.css               # 样式文件
├── script.js               # 前端逻辑（Leaflet.js）
├── boundary.geojson        # 范围边界数据
├── buildings.geojson       # 建筑物数据
├── countries.geojson       # 国家数据
├── user_points.geojson     # 用户兴趣点数据
├── backend/
│   ├── app.py             # Flask API服务
│   └── requirements.txt   # Python依赖
└── README.md              # 本文档
```

## 部署到 Google Cloud

### Phase 1: 后端部署
1. **创建 Cloud Storage 存储桶**存储 GeoJSON 文件
2. **设置 Cloud SQL + PostGIS**：
   ```sql
   CREATE EXTENSION postgis;
   CREATE TABLE user_points (
       id SERIAL PRIMARY KEY,
       notes TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       location GEOMETRY(Point, 4326)
   );
   CREATE INDEX user_points_location_idx ON user_points USING GIST (location);
   ```
3. **部署到 Cloud Run**：
   - 修改 `app.py` 连接真实的 GCS 和 Cloud SQL
   - 使用 Dockerfile 容器化
   - 部署到 Cloud Run 并配置 CORS

### Phase 2: 前端部署
1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 修改 `script.js` 中的 API_URL 为 Cloud Run 服务地址
4. 访问 `https://your-username.github.io/your-repo-name/`

## 开发说明

- **切换API模式**：修改 `script.js` 中的 `USE_LOCAL_API` 变量
- **添加新图层**：在后端添加新的API端点，前端添加对应的加载函数
- **自定义样式**：修改 `loadLayer()` 函数中的 `styleOptions`

## 技术栈

- **前端**：Leaflet.js 1.9.4, HTML5, CSS3, JavaScript ES6
- **后端**：Python 3.x, Flask, Flask-CORS
- **数据格式**：GeoJSON
- **底图服务**：OpenStreetMap, Google Maps

---

欢迎贡献和反馈！