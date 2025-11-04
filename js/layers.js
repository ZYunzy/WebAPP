// Layer management
class LayerManager {
    constructor(map) {
        this.map = map;
        this.dataLayers = {};
        this.layerGroups = {};
        this.initLayerGroups();
    }
    
    // Initialize layer groups
    initLayerGroups() {
        this.layerGroups = {
            slums: L.layerGroup().addTo(this.map),
            buildings: L.layerGroup().addTo(this.map),
            infrastructure: L.layerGroup(),
            population: L.layerGroup()
        };
    }
    
    // Load data layer
    async loadLayer(layerName, dataSource) {
        try {
            // Show loading indicator
            this.showLoading();
            
            let data;
            
            // Decide where to load data from based on configuration
            if (CONFIG.api.useLocal) {
                // Load from local API
                const endpoint = CONFIG.api.endpoints[layerName];
                const url = `${CONFIG.api.localUrl}${endpoint}`;
                const response = await fetch(url);
                data = await response.json();
            } else {
                // Load from static file (GitHub Pages)
                if (dataSource) {
                    const response = await fetch(dataSource);
                    data = await response.json();
                } else {
                    // Generate mock data if no data source provided
                    data = this.generateMockData(layerName);
                }
            }
            
            // Clear existing layer
            this.layerGroups[layerName].clearLayers();
            
            // Add GeoJSON data
            const geoJsonLayer = L.geoJSON(data, {
                style: (feature) => this.getStyle(layerName, feature),
                pointToLayer: (feature, latlng) => this.createMarker(layerName, feature, latlng),
                onEachFeature: (feature, layer) => this.bindPopup(feature, layer)
            });
            
            geoJsonLayer.addTo(this.layerGroups[layerName]);
            this.dataLayers[layerName] = geoJsonLayer;
            
            // Hide loading indicator
            this.hideLoading();
            
            return geoJsonLayer;
            
        } catch (error) {
            console.error(`Failed to load layer ${layerName}:`, error);
            this.hideLoading();
            this.showError(`Failed to load ${layerName} layer`);
        }
    }
    
    // Generate mock data
    generateMockData(layerName) {
        const center = CONFIG.map.center;
        const features = [];
        
        // Generate some random points or polygons
        for (let i = 0; i < 10; i++) {
            const offset = 0.05;
            const lat = center[0] + (Math.random() - 0.5) * offset;
            const lng = center[1] + (Math.random() - 0.5) * offset;
            
            if (layerName === 'buildings') {
                // Create building polygon
                features.push({
                    type: 'Feature',
                    properties: {
                        name: `Building ${i + 1}`,
                        type: 'Residential',
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
                // Create point feature
                features.push({
                    type: 'Feature',
                    properties: {
                        name: `${layerName} ${i + 1}`,
                        description: `This is a sample ${layerName} point`,
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
    
    // Get style
    getStyle(layerName, feature) {
        return CONFIG.styles[layerName] || {
            color: '#3388ff',
            fillColor: '#3388ff',
            fillOpacity: 0.3,
            weight: 2
        };
    }
    
    // Create marker
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
    
    // Bind popup
    bindPopup(feature, layer) {
        if (feature.properties) {
            let content = '<div class="popup-content">';
            content += `<h4>${feature.properties.name || 'Unnamed'}</h4>`;
            
            for (const [key, value] of Object.entries(feature.properties)) {
                if (key !== 'name') {
                    content += `<p><strong>${key}:</strong> ${value}</p>`;
                }
            }
            
            content += '</div>';
            layer.bindPopup(content);
            
            // Update info panel on click
            layer.on('click', () => {
                this.updateInfoPanel(feature.properties);
            });
        }
    }
    
    // Update info panel
    updateInfoPanel(properties) {
        const infoContent = document.getElementById('info-content');
        let html = '';
        
        for (const [key, value] of Object.entries(properties)) {
            html += `<p><strong>${key}:</strong> ${value}</p>`;
        }
        
        infoContent.innerHTML = html;
    }
    
    // Toggle layer visibility
    toggleLayer(layerName, show) {
        if (this.layerGroups[layerName]) {
            if (show) {
                this.map.addLayer(this.layerGroups[layerName]);
            } else {
                this.map.removeLayer(this.layerGroups[layerName]);
            }
        }
    }
    
    // Show loading indicator
    showLoading() {
        document.getElementById('loading').style.display = 'block';
    }
    
    // Hide loading indicator
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }
    
    // Show error
    showError(message) {
        alert(message);
    }
}
