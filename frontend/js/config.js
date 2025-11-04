// Configuration file
const CONFIG = {
    // API Configuration
    // api: {
    //     useLocal: false, // Set to true to use local API, false to use static data from GitHub
    //     localUrl: 'http://localhost:5000',
    //     endpoints: {
    //         slums: '/api/slums',
    //         buildings: '/api/buildings',
    //         infrastructure: '/api/infrastructure',
    //         population: '/api/population'
    //     }
        api: {
        useLocal: true, // 切换为 true 使用你的后端
        localUrl: 'http://10.13.154.182:8080', // <-- 把这里改为你的后端地址和端口
        endpoints: {
            slums: '/api/slums',
            buildings: '/api/buildings',
            infrastructure: '/api/infrastructure',
            population: '/api/population'
        }
    },
    
    // Initial Map Configuration
    map: {
        // center: [28.6139, 77.2090], // New Delhi coordinates (change to your target city)
        // center: [-1.314, 36.790], // Nairobi coordinates
        center: [5.548, -0.218], // Accra coordinates
        zoom: 12,
        minZoom: 3,
        maxZoom: 22
    },
    
    // Basemap Layer Configuration
    basemaps: {
        osm: {
            name: 'OpenStreetMap',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        },
        satellite: {
            name: 'Satellite Imagery',
            url: 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            attribution: '&copy; Google',
            maxZoom: 22,
            detectRetina: true,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        },
        terrain: {
            name: 'Terrain Map',
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
            maxZoom: 17
        },
        dark: {
            name: 'Dark Theme',
            url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19
        }
    },
    
    // Style Configuration
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
