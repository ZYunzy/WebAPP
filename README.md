# Slum Mapping - 贫民窟地图系统

这是一个基于 Leaflet.js 前端和 Flask 后端的交互式地图网站，用于展示和分析贫民窟相关数据。

## 🏗️ 系统架构

- **前端**: HTML5, CSS3, JavaScript (ES6+) with Leaflet.js 1.9.4
- **后端**: Python Flask (可选，支持静态部署)
- **部署**: GitHub Pages (前端) + Cloud Run (后端，可选)

## ✨ 功能特性

### 前端功能
- ✅ **多种底图切换**
  - OpenStreetMap（免费、开源）
  - 卫星影像（Esri）
  - 地形图（OpenTopoMap）
  - 暗色主题（CartoDB）
  
- ✅ **数据图层管理**
  - 贫民窟区域
  - 建筑物分布
  - 基础设施
  - 人口密度
  - 可自由切换显示/隐藏
  
- ✅ **交互功能**
  - 点击要素查看详细信息
  - 弹出窗口显示属性
  - 信息面板实时更新
  - 图例展示
  - 响应式设计（支持移动端）

### 后端API（可选）
- `GET /api/slums` - 获取贫民窟数据
- `GET /api/buildings` - 获取建筑物数据
- `GET /api/infrastructure` - 获取基础设施数据
- `GET /api/population` - 获取人口数据
- `GET /api/health` - 健康检查

## 🚀 快速开始

### 方式一：纯前端预览（推荐新手）

1. **本地预览**
   ```bash
   cd frontend
   python -m http.server 8000
   ```
   然后访问 http://localhost:8000

2. **或使用 VS Code Live Server**
   - 安装 Live Server 扩展
   - 右键 `frontend/index.html` → Open with Live Server

3. **直接打开**
   - 双击 `frontend/index.html` 在浏览器中打开

### 方式二：部署到 GitHub Pages（推荐）

1. **配置 Git**（如未配置）
   ```bash
   git config user.name "你的名字"
   git config user.email "you@example.com"
   ```

2. **提交代码**
   ```bash
   git add .
   git commit -m "添加贫民窟地图前端"
   git push origin main
   ```

3. **启用 GitHub Pages**
   - 进入 GitHub 仓库 → Settings → Pages
   - Source 选择 `main` 分支
   - 选择 `/frontend` 目录
   - 保存

4. **访问网站**
   ```
   https://zyunzy.github.io/SlumMapping/
   ```

### 方式三：前端 + 后端API（高级）

1. **启动后端服务**：
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```
   后端将在 http://localhost:5000 运行

2. **配置前端连接后端**：
   编辑 `frontend/js/config.js`：
   ```javascript
   api: {
       useLocal: true,  // 改为 true
       localUrl: 'http://localhost:5000'
   }
   ```

3. **访问前端**：
   使用方式一的任一方法启动前端
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