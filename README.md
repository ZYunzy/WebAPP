# 贫民窟地图系统 - 前端

基于 Leaflet.js 构建的交互式地图应用，用于展示和分析贫民窟相关数据。

## 功能特性

### ✨ 已实现功能

1. **多种底图切换**
   - OpenStreetMap（默认）
   - 卫星影像
   - 地形图
   - 暗色主题

2. **数据图层管理**
   - 贫民窟区域
   - 建筑物
   - 基础设施
   - 人口密度
   - 可自由切换显示/隐藏

3. **交互功能**
   - 点击要素查看详细信息
   - 弹出窗口显示属性
   - 信息面板实时更新
   - 响应式设计

4. **可视化**
   - 图例展示
   - 颜色编码
   - 自定义样式

## 目录结构

```
frontend/
├── index.html          # 主页面
├── css/
│   └── style.css      # 样式文件
├── js/
│   ├── config.js      # 配置文件
│   ├── map.js         # 地图管理
│   ├── layers.js      # 图层管理
│   └── main.js        # 主程序
└── data/              # 数据文件（可选）
    ├── slums.geojson
    ├── buildings.geojson
    └── ...
```

## 快速开始

### 方法1：本地预览（推荐）

使用 Python 内置服务器：

```bash
# 进入 frontend 目录
cd frontend

# Python 3
python -m http.server 8000

# 或 Python 2
python -m SimpleHTTPServer 8000
```

然后在浏览器打开 `http://localhost:8000`

### 方法2：VS Code Live Server

1. 安装 Live Server 扩展
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

### 方法3：直接打开

直接在浏览器中打开 `frontend/index.html` 文件

## 部署到 GitHub Pages

### 步骤1：准备仓库

```bash
cd webapp
git add .
git commit -m "添加前端页面"
git push origin main
```

### 步骤2：配置 GitHub Pages

1. 进入 GitHub 仓库页面
2. 点击 Settings（设置）
3. 找到 Pages 部分
4. Source 选择 `main` 分支
5. 选择根目录或 `/frontend` 目录
6. 保存

### 步骤3：访问网站

稍等片刻后，访问：
```
https://zyunzy.github.io/SlumMapping/frontend/
```

## 配置说明

### 修改地图中心和缩放

编辑 `js/config.js`：

```javascript
map: {
    center: [纬度, 经度],  // 改为您的目标位置
    zoom: 12,              // 初始缩放级别
    minZoom: 3,
    maxZoom: 18
}
```

### 连接后端 API

编辑 `js/config.js`：

```javascript
api: {
    useLocal: true,  // 改为 true 使用后端 API
    localUrl: 'http://localhost:5000',
    endpoints: {
        slums: '/api/slums',
        buildings: '/api/buildings',
        // ... 其他端点
    }
}
```

### 添加静态数据

将 GeoJSON 文件放到 `data/` 目录，然后在 `main.js` 中加载：

```javascript
await layerManager.loadLayer('slums', 'data/slums.geojson');
```

## 自定义样式

### 修改图层颜色

编辑 `js/config.js` 的 `styles` 部分：

```javascript
styles: {
    slums: {
        color: '#e74c3c',        // 边框颜色
        fillColor: '#e74c3c',    // 填充颜色
        fillOpacity: 0.3,        // 透明度
        weight: 2                // 边框宽度
    }
}
```

### 修改界面样式

编辑 `css/style.css` 文件

## 数据格式

支持标准 GeoJSON 格式：

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "区域名称",
        "population": 1000,
        "area": 500
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[经度, 纬度], ...]]
      }
    }
  ]
}
```

## 浏览器兼容性

- Chrome / Edge (推荐)
- Firefox
- Safari
- Opera

## 性能优化建议

1. 大数据集使用聚类（Leaflet.markercluster）
2. 启用 GeoJSON 简化
3. 使用 CDN 加速资源加载
4. 压缩 CSS/JS 文件

## 常见问题

### Q: 地图显示空白？
A: 检查浏览器控制台错误，确认网络连接正常

### Q: 数据不显示？
A: 确认 GeoJSON 格式正确，检查文件路径

### Q: GitHub Pages 404？
A: 确认分支和目录设置正确，等待几分钟让 GitHub 部署

## 下一步

- [ ] 添加真实数据
- [ ] 连接后端 API
- [ ] 添加搜索功能
- [ ] 添加数据筛选
- [ ] 添加数据导出
- [ ] 优化移动端体验

## 技术栈

- Leaflet.js 1.9.4
- 原生 JavaScript (ES6+)
- CSS3
- HTML5

## 许可证

MIT License
