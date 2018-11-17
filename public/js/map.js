//For local development need to run a local webserver to load the CSV file. Use python3 -m http.server 8888

var mymap = L.map('mapid').setView([35.59841484754639, -106.73698425292969], 3);

L.tileLayer.provider('CartoDB.DarkMatter').addTo(mymap);

var mki = L.icon.mapkey({
  icon:"adit",
  background:false,
  boxShadow:false,
  hoverCSS:'background-color:#992b00'
})

var markerStyle = L.geoJson(null, {
 onEachFeature: function(feature, layer) {
     layer.bindPopup('<b>' + feature.properties.Title + '</b>' + '<br/>' + feature.properties.Location + '<br/>' + '<a href="' + feature.properties.Normalized_Website + '">' + feature.properties.Normalized_Website + '</a>');
 },
 pointToLayer: function (feature, latlng) {
     return L.marker(latlng, {icon:mki});
   }
});

var wsdeLayer = omnivore.csv('/locations.csv', null, markerStyle)
  .on("ready", function() {
    var markers = L.markerClusterGroup();
    markers.addLayer(wsdeLayer);
    markers.addTo(mymap);
  });
