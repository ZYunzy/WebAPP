// 地图初始化和管理
class MapManager {
    constructor() {
        this.map = null;
        this.currentBasemap = null;
        this.basemapLayers = {};
    }
    
    // 初始化地图
    init() {
        // 创建地图实例
        this.map = L.map('map', {
            center: CONFIG.map.center,
            zoom: CONFIG.map.zoom,
            minZoom: CONFIG.map.minZoom,
            maxZoom: CONFIG.map.maxZoom,
            zoomControl: true
        });
        
        // 创建所有底图图层
        this.createBasemapLayers();
        
        // 添加默认底图
        this.switchBasemap('osm');
        
        // 添加比例尺
        L.control.scale({
            imperial: false,
            metric: true
        }).addTo(this.map);
        
        return this.map;
    }
    
    // 创建底图图层
    createBasemapLayers() {
        for (const [key, config] of Object.entries(CONFIG.basemaps)) {
            this.basemapLayers[key] = L.tileLayer(config.url, {
                attribution: config.attribution,
                maxZoom: config.maxZoom
            });
        }
    }
    
    // 切换底图
    switchBasemap(basemapKey) {
        // 移除当前底图
        if (this.currentBasemap) {
            this.map.removeLayer(this.currentBasemap);
        }
        
        // 添加新底图
        if (this.basemapLayers[basemapKey]) {
            this.currentBasemap = this.basemapLayers[basemapKey];
            this.currentBasemap.addTo(this.map);
        }
    }
    
    // 获取地图实例
    getMap() {
        return this.map;
    }
    
    // 飞到指定位置
    flyTo(latlng, zoom = 15) {
        this.map.flyTo(latlng, zoom, {
            duration: 1.5
        });
    }
    
    // 适应边界
    fitBounds(bounds, options = {}) {
        this.map.fitBounds(bounds, {
            padding: [50, 50],
            ...options
        });
    }
}
