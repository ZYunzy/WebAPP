// 主应用程序
let mapManager;
let layerManager;

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('初始化贫民窟地图系统...');
    
    // 初始化地图
    mapManager = new MapManager();
    mapManager.init();
    
    // 初始化图层管理器
    layerManager = new LayerManager(mapManager.getMap());
    
    // 加载默认数据图层
    loadInitialLayers();
    
    // 设置事件监听器
    setupEventListeners();
    
    console.log('地图系统初始化完成');
});

// 加载初始图层
async function loadInitialLayers() {
    // 加载贫民窟图层（如果有静态数据文件）
    // await layerManager.loadLayer('slums', 'data/slums.geojson');
    
    // 加载建筑物图层（如果有静态数据文件）
    // await layerManager.loadLayer('buildings', 'data/buildings.geojson');
    
    // 如果没有静态数据，将加载模拟数据
    await layerManager.loadLayer('slums');
    await layerManager.loadLayer('buildings');
}

// 设置事件监听器
function setupEventListeners() {
    // 底图切换
    const basemapRadios = document.querySelectorAll('input[name="basemap"]');
    basemapRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            mapManager.switchBasemap(e.target.value);
        });
    });
    
    // 数据图层切换
    const layerCheckboxes = {
        'layer-slums': 'slums',
        'layer-buildings': 'buildings',
        'layer-infrastructure': 'infrastructure',
        'layer-population': 'population'
    };
    
    for (const [checkboxId, layerName] of Object.entries(layerCheckboxes)) {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.addEventListener('change', async (e) => {
                const isChecked = e.target.checked;
                
                // 如果是首次加载该图层
                if (isChecked && !layerManager.dataLayers[layerName]) {
                    await layerManager.loadLayer(layerName);
                } else {
                    layerManager.toggleLayer(layerName, isChecked);
                }
            });
        }
    }
}

// 导出全局函数（可选）
window.mapManager = mapManager;
window.layerManager = layerManager;
