//For local development need to run a local webserver to load the CSV file. Use python3 -m http.server 8888

// var mymap = L.map('mapid').setView([35.59841484754639, -106.73698425292969], 3);

var darkmatter = L.tileLayer.provider('CartoDB.DarkMatterNoLabels'),
    positron = L.tileLayer.provider('CartoDB.PositronNoLabels'),
    income = L.tileLayer.provider('JusticeMap.income'),
    // black = L.tileLayer.provider('JusticeMap.black'),
    // nonwhite = L.tileLayer.provider('JusticeMap.nonWhite'),
    lines = L.tileLayer.provider('Stamen.TonerLines'),
    labels = L.tileLayer.provider('Stamen.TonerLabels'),
    blackBlockGroups = L.tileLayer('http://www.justicemap.org/tile/{size}/black/{z}/{x}/{y}.png', {
        attribution: '<a href="http://www.justicemap.org/terms.php">Justice Map</a>',
    	  size: 'bg',
        opacity: 0.5,
    	  bounds: [[14, -180], [72, -56]]
    });

var mki = L.icon.mapkey({
    icon:"adit",
    color:"DarkRed",
    background:false,
    boxShadow:false,
});

var markerStyle = L.geoJson(null, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup('<b>' + feature.properties.Title + '</b>' + '<br/>' + feature.properties.Location + '<br/>' + '<a href="' + feature.properties.Normalized_Website + '">' + feature.properties.Normalized_Website + '</a>');
    },
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon:mki});
    }
});

var wsdeLayer = omnivore.csv('data/locations.csv', null, markerStyle)
    .on("ready", function() {
        var markers = L.markerClusterGroup();
        markers.addLayer(wsdeLayer);
        // markers.addTo(mymap);
        var mymap = L.map('mapid', {
            center: [35.59841484754639, -106.73698425292969],
            zoom: 4,
            attributionControl: false, //Just leaving for development
            layers: [positron, lines, labels, markers]
        });

        var overlayMaps = {
            "Lines": lines,
            "Labels": labels,
            "Black (race)": blackBlockGroups,
            // "POC": nonwhite,
            "WSDEs": markers
        };

        var baseMaps = {
            "Light": positron,
            "Dark": darkmatter

        };

        L.control.layers(baseMaps, overlayMaps).addTo(mymap);

    });
