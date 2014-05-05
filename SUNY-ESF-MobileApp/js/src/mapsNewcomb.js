// JavaScript Document
// Newcomb Campus Map Model
var NewcombMapModel = Backbone.Model.extend({
        defaults: {
          id:  'newcomb',
          lat:  '43.972084',
          long: '-74.182035',
          zoom: '14'
       },
        addLayers:   function (map) {
          // Add Newcomb buildings and markers
          map.addLayer(this.newMarkers, false);
         // map.addLayer(this.rsBldgs, false);

       },
        removeLayers:   function (map) {
          // Remove Newcomb buildings and markers
          map.removeLayer(this.newMarkers);
          //map.removeLayer(this.rsBldgs);
       },
       initialize:  function () {
          // Initialize markers
          var aecMarker = L.marker([43.972872, -74.183237]);
          aecMarker.bindPopup("<strong>Adirondack Ecological Center</strong><br /><a target='_blank' href='http://www.esf.edu/campuses/aec/'>Website</a>");
          var aicMarker = L.marker([43.972084, -74.182035]);
          aicMarker.bindPopup("<strong>Adirondack Interpretive Center</strong><br /><a target='_blank' href='http://www.esf.edu/aic/'>Website</a>");
          var nfiMarker = L.marker([44.144998,-74.903054]);
          nfiMarker.bindPopup("<strong>Northern Forest Institute</strong><br /><a target='_blank' href='http://www.esf.edu/nfi/'>Website</a>");
          this.newMarkers = L.layerGroup([aecMarker, aicMarker]);

          //this.rsBldgs = L.layerGroup([rangerschool]);
        },
});
