// API配置 - 切换到本地API或远程Cloud Run API
const USE_LOCAL_API = true; // 设为false使用本地文件
const API_URL = USE_LOCAL_API ? 'http://localhost:5000' : '';

// 1. Initialize the map
const map = L.map('map').setView([40.0076, -105.2659], 6);

// 2. 定义底图图层
const baseMaps = {
    osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }),
    googleSatellite: L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '© Google'
    }),
    googleRoadmap: L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '© Google'
    })
};

// 默认添加OSM底图
let currentBaseMap = baseMaps.osm.addTo(map);

// 3. 创建数据图层组
const dataLayers = {
    boundary: L.layerGroup().addTo(map),
    buildings: L.layerGroup().addTo(map),
    countries: L.layerGroup().addTo(map),
    userPoints: L.layerGroup().addTo(map)
};

// 4. 从API加载图层数据
function loadLayer(layerName, endpoint, styleOptions) {
    const url = USE_LOCAL_API ? `${API_URL}/api/${endpoint}` : `${endpoint}.geojson`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            dataLayers[layerName].clearLayers();
            L.geoJSON(data, {
                style: styleOptions.style || null,
                pointToLayer: styleOptions.pointToLayer || null,
                onEachFeature: (feature, layer) => {
                    if (feature.properties) {
                        let popupContent = '<div class="popup-content">';
                        for (const [key, value] of Object.entries(feature.properties)) {
                            popupContent += `<strong>${key}:</strong> ${value}<br>`;
                        }
                        popupContent += '</div>';
                        layer.bindPopup(popupContent);
                    }
                }
            }).addTo(dataLayers[layerName]);
        })
        .catch(error => console.error(`Error loading ${layerName}:`, error));
}

// 加载所有图层
loadLayer('boundary', 'boundary', {
    style: { color: "#FF0000", weight: 3, fillOpacity: 0.1, dashArray: '5, 5' }
});

loadLayer('buildings', 'buildings', {
    style: { color: "#800000", weight: 2, fillColor: "#FFA500", fillOpacity: 0.5 }
});

loadLayer('countries', 'countries', {
    style: { color: "#0000FF", weight: 2, fillColor: "#87CEEB", fillOpacity: 0.3 }
});

loadLayer('userPoints', 'user-points', {
    pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
            radius: 8,
            fillColor: "#00FF00",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    }
});

// 5. 底图切换控制
document.querySelectorAll('input[name="basemap"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        map.removeLayer(currentBaseMap);
        switch(e.target.value) {
            case 'osm':
                currentBaseMap = baseMaps.osm;
                break;
            case 'google-satellite':
                currentBaseMap = baseMaps.googleSatellite;
                break;
            case 'google-roadmap':
                currentBaseMap = baseMaps.googleRoadmap;
                break;
        }
        currentBaseMap.addTo(map);
    });
});

// 6. 图层显示/隐藏控制
document.getElementById('layer-boundary').addEventListener('change', (e) => {
    if (e.target.checked) {
        map.addLayer(dataLayers.boundary);
    } else {
        map.removeLayer(dataLayers.boundary);
    }
});

document.getElementById('layer-buildings').addEventListener('change', (e) => {
    if (e.target.checked) {
        map.addLayer(dataLayers.buildings);
    } else {
        map.removeLayer(dataLayers.buildings);
    }
});

document.getElementById('layer-countries').addEventListener('change', (e) => {
    if (e.target.checked) {
        map.addLayer(dataLayers.countries);
    } else {
        map.removeLayer(dataLayers.countries);
    }
});

document.getElementById('layer-user-points').addEventListener('change', (e) => {
    if (e.target.checked) {
        map.addLayer(dataLayers.userPoints);
    } else {
        map.removeLayer(dataLayers.userPoints);
    }
});

// 7. 添加用户兴趣点交互
map.on('click', function(e) {
    const notes = prompt("输入这个位置的备注:");
    if (notes) {
        const newPoint = {
            notes: notes,
            lat: e.latlng.lat,
            lon: e.latlng.lng
        };

        const url = USE_LOCAL_API ? `${API_URL}/api/user-points` : null;
        
        if (url) {
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPoint)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Point saved:', data.message);
                // 重新加载用户点图层
                loadLayer('userPoints', 'user-points', {
                    pointToLayer: (feature, latlng) => {
                        return L.circleMarker(latlng, {
                            radius: 8,
                            fillColor: "#00FF00",
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        });
                    }
                });
            })
            .catch(error => console.error('Error saving point:', error));
        } else {
            console.log('Simulating save:', newPoint);
            alert('点已保存 (模拟): ' + notes);
        }
    }
});