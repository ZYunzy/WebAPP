// Main application
let mapManager;
let layerManager;

// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Slum Mapping System...');
    
    // Initialize map
    mapManager = new MapManager();
    mapManager.init();
    
    // Initialize layer manager
    layerManager = new LayerManager(mapManager.getMap());
    
    // Load default data layers
    loadInitialLayers();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('Map system initialized successfully');
});

// Load initial layers
async function loadInitialLayers() {
    // Load slum layer (if static data file exists)
    // await layerManager.loadLayer('slums', 'data/slums.geojson');
    
    // Load buildings layer (if static data file exists)
    // await layerManager.loadLayer('buildings', 'data/buildings.geojson');
    
    // If no static data, load mock data
    await layerManager.loadLayer('slums');
    await layerManager.loadLayer('buildings');
}

// Setup event listeners
function setupEventListeners() {
    // Basemap switching
    const basemapRadios = document.querySelectorAll('input[name="basemap"]');
    basemapRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            mapManager.switchBasemap(e.target.value);
        });
    });
    
    // Data layer toggling
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
                
                // Load layer for the first time if checked
                if (isChecked && !layerManager.dataLayers[layerName]) {
                    await layerManager.loadLayer(layerName);
                } else {
                    layerManager.toggleLayer(layerName, isChecked);
                }
            });
        }
    }
}

// Export global functions (optional)
window.mapManager = mapManager;
window.layerManager = layerManager;

// Toggle panel collapse/expand
function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.toggle('collapsed');
    }
}

// Make toggle function globally available
window.togglePanel = togglePanel;
