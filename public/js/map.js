//For local development need to run a local webserver to load the CSV file. Use python3 -m http.server 8888

var darkmatter = L.tileLayer.provider('CartoDB.DarkMatter'),
    positron = L.tileLayer.provider('CartoDB.Positron'),
    toner = L.tileLayer.provider('Stamen.Toner'),
    tonerLite = L.tileLayer.provider('Stamen.TonerLite'),
    // income = L.tileLayer.provider('JusticeMap.income'),
    // black = L.tileLayer.provider('JusticeMap.black'),
    // nonwhite = L.tileLayer.provider('JusticeMap.nonWhite'),
    // lines = L.tileLayer.provider('Stamen.TonerLines'),
    // labels = L.tileLayer.provider('Stamen.TonerLabels'),
    // blackBlockGroups = L.tileLayer('http://www.justicemap.org/tile/{size}/black/{z}/{x}/{y}.png', {
    //     attribution: '<a href="http://www.justicemap.org/terms.php">Justice Map</a>',
    // 	  size: 'bg',
    //     opacity: 0.6,
    // 	  bounds: [[14, -180], [72, -56]]
    // }),
    blackDot = L.tileLayer('http://demographics.virginia.edu/DotMap/tiles4/{z}/{x}/{y}.png', {
        attribution: '',
        opacity: 0.7,
    	  bounds: [[14, -180], [72, -56]]
    }),
    blackBlock = L.tileLayer('http://www.justicemap.org/tile/{size}/black/{z}/{x}/{y}.png', {
        attribution: '<a href="http://www.justicemap.org/terms.php">Justice Map</a>',
    	  size: 'block',
        opacity: 0.4,
    	  bounds: [[14, -180], [72, -56]]
    });

var mki = L.icon.mapkey({
    icon:"adit",
    color:"#424242",
    // hoverCSS: "background-color:#992b00",
    background:"#FFFFFF",
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

var legendHtml = `<div style="font-size: 0.74em; width: auto; min-height: 112px; max-height: none; height: auto;"><div font-size:0.9em; width:90px; vertical-align:top;"></div>
<div style="padding:2px;" ><span id="color_0" style="background:#ffffcc; width:10px; height:10px;">
   &nbsp;&nbsp;&nbsp;&nbsp;</span><span> 0 - 1%</span></div><div style="padding:2px;"><span id="color_1" style="background:#ffeda0; width:10px; height:10px;">
   &nbsp;&nbsp;&nbsp;&nbsp;</span><span> 1 - 2.5%</span></div><div style="padding:2px;"><span id="color_2" style="background:#fed976; width:10px; height:10px;">
   &nbsp;&nbsp;&nbsp;&nbsp;</span><span> 2.5 - 5%</span></div><div style="padding:2px;"><span id="color_3" style="background:#feb24c; width:10px; height:10px;">
   &nbsp;&nbsp;&nbsp;&nbsp;</span><span> 5 - 9%</span></div><div style="padding:2px;"><span id="color_4" style="background:#fd8d3c; width:10px; height:10px;">
   &nbsp;&nbsp;&nbsp;&nbsp;</span><span> 9 - 16%</span></div><div style="padding:2px;"><span id="color_5" style="background:#fc4e2a; width:10px; height:10px;">
   &nbsp;&nbsp;&nbsp;&nbsp;</span><span> 16 - 26%</span></div><div style="padding:2px;"><span id="color_6" style="background:#e31a1c; width:10px; height:10px;">
   &nbsp;&nbsp;&nbsp;&nbsp;</span><span> 26 - 47%</span></div><div style="padding:2px;"><span id="color_7" style="background:#bd0026; width:10px; height:10px;">
   &nbsp;&nbsp;&nbsp;&nbsp;</span><span> 47 - 79%</span></div><div style="padding:2px;"><span id="color_8" style="background:#800026; width:10px; height:10px;">
   &nbsp;&nbsp;&nbsp;&nbsp;</span><span> 79 - 100%</span></div>
</div>`;

// var blackBlockGroupsLegend = L.control.htmllegend({
//   position: 'bottomright',
//   // collapsedOnInit: true,
//   // defaultOpacity: 0.1,
//   disableVisibilityControls: true,
//   legends: [{
//             name: 'Black (race) </br> pop. density',
//             layer: blackBlockGroups,
//             elements: [{ html: legendHtml }]
//     }]
// });

var blackBlockLegend = L.control.htmllegend({
  position: 'bottomright',
  // collapsedOnInit: true,
  // defaultOpacity: 0.1,
  disableVisibilityControls: true,
  legends: [{
            name: 'Black (race) </br> pop. density',
            layer: blackBlock,
            elements: [{ html: legendHtml }]
    }]
});

var markers = L.markerClusterGroup();

var controlSearch = new L.Control.Search({
    propertyName: 'Title',
    layer: markers,
    initial: false,
    firstTipSubmit: true,
    zoom: 12,
    position: "topcenter",
    collapsed: false,
    autoCollapse: true,
    marker: false
});

var wsdeLayer = omnivore.csv('data/locations.csv', null, markerStyle)
    .on("ready", function() {
        markers.addLayer(wsdeLayer);
        var mymap = L.map('mapid', {
            center: [35.59841484754639, -106.73698425292969],
            zoom: 4,
            minZoom: 3,
            maxZoom: 14,
            attributionControl: false, //Just leaving for development
            layers: [darkmatter, markers]
        });

        var overlayMaps = {
            // "Lines": lines,
            // "Labels": labels,
            // "Black (race) block groups": blackBlockGroups,
            "Black (race)": blackBlock,
            "(ENHANCE!)": blackDot,
            // "POC": nonwhite,
            // "income": income,
            // "WSDEs": markers
        };

        var baseMaps = {
            "Toner": toner,
            "Toner Lite": tonerLite,
            "Light": positron,
            "Dark": darkmatter
        };

        controlSearch.on('search:locationfound', function(event) {
            markers.zoomToShowLayer(event.layer, function() {
              event.layer.openPopup()
            });
        });

        L.control.layers(baseMaps, overlayMaps).addTo(mymap);
        // mymap.addControl(blackBlockGroupsLegend);
        mymap.addControl(blackBlockLegend);
        mymap.addControl(controlSearch);
    });
