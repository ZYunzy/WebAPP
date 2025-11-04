// 配置文件
const CONFIG = {
    // API 配置
    api: {
        useLocal: false, // 设为 true 使用本地 API，false 使用 GitHub 上的静态数据
        localUrl: 'http://localhost:5000',
        endpoints: {
            slums: '/api/slums',
            buildings: '/api/buildings',
            infrastructure: '/api/infrastructure',
            population: '/api/population'
        }
    },
    
    // 地图初始配置
    map: {
        // center: [28.6139, 77.2090], // 新德里坐标（可以改为您的目标城市）
        // center: [-1.314, 36.790], // Nairobi coordinates
        center: [5.548, -0.218],
        zoom: 12,
        minZoom: 3,
        maxZoom: 18
    },
    
    // 底图图层配置
    basemaps: {
        osm: {
            name: 'OpenStreetMap',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        },
        satellite: {
            name: '卫星影像',
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 18
        },
        terrain: {
            name: '地形图',
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
            maxZoom: 17
        },
        dark: {
            name: '暗色主题',
            url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19
        }
    },
    
    // 样式配置
    styles: {
        slums: {
            color: '#e74c3c',
            fillColor: '#e74c3c',
            fillOpacity: 0.3,
            weight: 2
        },
        buildings: {
            color: '#3498db',
            fillColor: '#3498db',
            fillOpacity: 0.4,
            weight: 1
        },
        infrastructure: {
            color: '#2ecc71',
            fillColor: '#2ecc71',
            fillOpacity: 0.3,
            weight: 2
        },
        population: {
            color: '#f39c12',
            fillColor: '#f39c12',
            fillOpacity: 0.5,
            weight: 1
        }
    }
};
