// JavaScript Document
// Thousand Islands Map Model
var ThousandMapModel = Backbone.Model.extend({
        defaults: {
          id:  'thousand',
          lat:  '44.248896',
          long: '-76.097913',
          zoom: '13'
       },
        addLayers:   function (map) {
          // Add Newcomb buildings and markers
          map.addLayer(this.tibsMarkers, false);
         // map.addLayer(this.rsBldgs, false);

       },
        removeLayers:   function (map) {
          // Remove Newcomb buildings and markers
          map.removeLayer(this.tibsMarkers);
          //map.removeLayer(this.rsBldgs);
       },
       initialize:  function () {
          // Initialize markers
          var tibsMarker = L.marker([44.248896, -76.097913]);
          tibsMarker.bindPopup("<strong>Thousand Islands Biological Center</strong><br /><a target='_blank' href='http://www.esf.edu/tibs/'>Website</a>");

          this.tibsMarkers = L.layerGroup([tibsMarker]);

          //this.rsBldgs = L.layerGroup([rangerschool]);
       },
});
