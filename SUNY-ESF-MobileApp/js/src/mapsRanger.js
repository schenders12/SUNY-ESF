// JavaScript Document
    // Ranger School Map Model
     var RangerMapModel = Backbone.Model.extend({
        defaults: {
          id:  'ranger',
          lat:  '44.144998',
          long: '-74.903054',
          zoom: '15'
       },
        addLayers:   function (map) {
          // Add Ranger School buildings and markers
          map.addLayer(this.rsMarkers, false);
         // map.addLayer(this.rsBldgs, false);

       },
        removeLayers:   function (map) {
          // Remove Ranger School buildings and markers
          map.removeLayer(this.rsMarkers);
          //map.removeLayer(this.rsBldgs);
       },
       initialize:  function () {
          // Initialize markers
          var rsMarker = L.marker([44.144998,-74.903054]);
          rsMarker.bindPopup("<strong>SUNY ESF Ranger School</strong><br /><a target='_blank' href='http://www.esf.edu/rangerschool/'>Website</a>");
          this.rsMarkers = L.layerGroup([rsMarker]);

          //this.rsBldgs = L.layerGroup([rangerschool]);
           },
     });
