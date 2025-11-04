// 图层管理
class LayerManager {
    constructor(map) {
        this.map = map;
        this.dataLayers = {};
        this.layerGroups = {};
        this.initLayerGroups();
    }
    
    // 初始化图层组
    initLayerGroups() {
        this.layerGroups = {
            slums: L.layerGroup().addTo(this.map),
            buildings: L.layerGroup().addTo(this.map),
            infrastructure: L.layerGroup(),
            population: L.layerGroup()
        };
    }
    
    // 加载数据图层
    async loadLayer(layerName, dataSource) {
        try {
            // 显示加载指示器
            this.showLoading();
            
            let data;
            
            // 根据配置决定从哪里加载数据
            if (CONFIG.api.useLocal) {
                // 从本地 API 加载
                const endpoint = CONFIG.api.endpoints[layerName];
                const url = `${CONFIG.api.localUrl}${endpoint}`;
                const response = await fetch(url);
                data = await response.json();
            } else {
                // 从静态文件加载（GitHub Pages）
                if (dataSource) {
                    const response = await fetch(dataSource);
                    data = await response.json();
                } else {
                    // 如果没有提供数据源，生成模拟数据
                    data = this.generateMockData(layerName);
                }
            }
            
            // 清除现有图层
            this.layerGroups[layerName].clearLayers();
            
            // 添加 GeoJSON 数据
            const geoJsonLayer = L.geoJSON(data, {
                style: (feature) => this.getStyle(layerName, feature),
                pointToLayer: (feature, latlng) => this.createMarker(layerName, feature, latlng),
                onEachFeature: (feature, layer) => this.bindPopup(feature, layer)
            });
            
            geoJsonLayer.addTo(this.layerGroups[layerName]);
            this.dataLayers[layerName] = geoJsonLayer;
            
            // 隐藏加载指示器
            this.hideLoading();
            
            return geoJsonLayer;
            
        } catch (error) {
            console.error(`加载图层 ${layerName} 失败:`, error);
            this.hideLoading();
            this.showError(`加载 ${layerName} 图层失败`);
        }
    }
    
    // 生成模拟数据
    generateMockData(layerName) {
        const center = CONFIG.map.center;
        const features = [];
        
        // 生成一些随机点或多边形
        for (let i = 0; i < 10; i++) {
            const offset = 0.05;
            const lat = center[0] + (Math.random() - 0.5) * offset;
            const lng = center[1] + (Math.random() - 0.5) * offset;
            
            if (layerName === 'buildings') {
                // 创建建筑物多边形
                features.push({
                    type: 'Feature',
                    properties: {
                        name: `建筑物 ${i + 1}`,
                        type: '居住建筑',
                        floors: Math.floor(Math.random() * 10) + 1
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[
                            [lng, lat],
                            [lng + 0.001, lat],
                            [lng + 0.001, lat + 0.001],
                            [lng, lat + 0.001],
                            [lng, lat]
                        ]]
                    }
                });
            } else {
                // 创建点要素
                features.push({
                    type: 'Feature',
                    properties: {
                        name: `${layerName} ${i + 1}`,
                        description: `这是一个示例 ${layerName} 点`,
                        value: Math.random() * 100
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    }
                });
            }
        }
        
        return {
            type: 'FeatureCollection',
            features: features
        };
    }
    
    // 获取样式
    getStyle(layerName, feature) {
        return CONFIG.styles[layerName] || {
            color: '#3388ff',
            fillColor: '#3388ff',
            fillOpacity: 0.3,
            weight: 2
        };
    }
    
    // 创建标记
    createMarker(layerName, feature, latlng) {
        const style = CONFIG.styles[layerName];
        return L.circleMarker(latlng, {
            radius: 8,
            fillColor: style.fillColor,
            color: style.color,
            weight: 2,
            opacity: 1,
            fillOpacity: 0.6
        });
    }
    
    // 绑定弹出窗口
    bindPopup(feature, layer) {
        if (feature.properties) {
            let content = '<div class="popup-content">';
            content += `<h4>${feature.properties.name || '未命名'}</h4>`;
            
            for (const [key, value] of Object.entries(feature.properties)) {
                if (key !== 'name') {
                    content += `<p><strong>${key}:</strong> ${value}</p>`;
                }
            }
            
            content += '</div>';
            layer.bindPopup(content);
            
            // 点击时更新信息面板
            layer.on('click', () => {
                this.updateInfoPanel(feature.properties);
            });
        }
    }
    
    // 更新信息面板
    updateInfoPanel(properties) {
        const infoContent = document.getElementById('info-content');
        let html = '';
        
        for (const [key, value] of Object.entries(properties)) {
            html += `<p><strong>${key}:</strong> ${value}</p>`;
        }
        
        infoContent.innerHTML = html;
    }
    
    // 切换图层显示/隐藏
    toggleLayer(layerName, show) {
        if (this.layerGroups[layerName]) {
            if (show) {
                this.map.addLayer(this.layerGroups[layerName]);
            } else {
                this.map.removeLayer(this.layerGroups[layerName]);
            }
        }
    }
    
    // 显示加载指示器
    showLoading() {
        document.getElementById('loading').style.display = 'block';
    }
    
    // 隐藏加载指示器
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }
    
    // 显示错误
    showError(message) {
        alert(message);
    }
}
