// Map initialization and management
class MapManager {
    constructor() {
        this.map = null;
        this.currentBasemap = null;
        this.basemapLayers = {};
    }
    
    // Initialize map
    init() {
        // Create map instance
        this.map = L.map('map', {
            center: CONFIG.map.center,
            zoom: CONFIG.map.zoom,
            minZoom: CONFIG.map.minZoom,
            maxZoom: CONFIG.map.maxZoom,
            zoomControl: true
        });
        
        // Create all basemap layers
        this.createBasemapLayers();
        
        // Add default basemap (Google Satellite)
        this.switchBasemap('satellite');
        
        // Add scale control
        L.control.scale({
            imperial: false,
            metric: true
        }).addTo(this.map);
        
        return this.map;
    }
    
    // Create basemap layers
    createBasemapLayers() {
        for (const [key, config] of Object.entries(CONFIG.basemaps)) {
            const options = {
                attribution: config.attribution,
                maxZoom: config.maxZoom
            };
            
            // Add additional options for Google Maps
            if (config.detectRetina) {
                options.detectRetina = config.detectRetina;
            }
            if (config.subdomains) {
                options.subdomains = config.subdomains;
            }
            
            this.basemapLayers[key] = L.tileLayer(config.url, options);
        }
    }
    
    // Switch basemap
    switchBasemap(basemapKey) {
        // Remove current basemap
        if (this.currentBasemap) {
            this.map.removeLayer(this.currentBasemap);
        }
        
        // Add new basemap
        if (this.basemapLayers[basemapKey]) {
            this.currentBasemap = this.basemapLayers[basemapKey];
            this.currentBasemap.addTo(this.map);
        }
    }
    
    // Get map instance
    getMap() {
        return this.map;
    }
    
    // Fly to specified location
    flyTo(latlng, zoom = 15) {
        this.map.flyTo(latlng, zoom, {
            duration: 1.5
        });
    }
    
    // Fit bounds
    fitBounds(bounds, options = {}) {
        this.map.fitBounds(bounds, {
            padding: [50, 50],
            ...options
        });
    }
}
