// JavaScript Document
// Main ESF Campus Map Model
var MainMapModel = Backbone.Model.extend({
        defaults: {
          id:  'main',
          lat:  '43.0347073',
          long: '-76.1355346',
          zoom: '17',
        },
        urlRoot: "http://www.esf.edu/mobile/app/ESFMobileApp/maps/main/map_main_def.json",
        addLayers:   function (map) {
          // Add Main campus buildings and markers
          map.addLayer(this.mainBldgs, false);
          //map.addLayer(this.subldgs, false);
         // map.addLayer(this.esfparking, false);
          map.addLayer(this.mainMarkers, false);
          // FourSquare??
          //this.fourSquare(map);
       },
        removeLayers:   function (map) {
          // Remove Main campus buildings and markers
          map.removeLayer(this.mainBldgs);
          //map.removeLayer(this.subldgs);
         // map.removeLayer(this.esfparking, false);
          map.removeLayer(this.mainMarkers);
       },

       initialize:  function () {
          // Colors
          var buildingFill = '#559824';
          var outlineFill = '#01589d';
          var suFill = '#ff6600';
          var parkingFill = '#cccccc';
          var constructionFill = '#FF0000';
          var tempFill = '#FFFFFF';

          var buildingOptions = {
             color: outlineFill,
             fillColor: buildingFill,
             fillOpacity: 0,
             weight: 3,
             opacity:  .5,
             //dashArray: '3'
          };

          // Initialize markers
          var upgate = L.marker([43.0358, -76.13807]);
          var univpolice = L.marker([43.03465, -76.13457]);
          var marshallMarker = L.marker([43.03422, -76.13600]);
          var centennialMarker = L.marker([43.03363, -76.14081]);
          var bakerMarker = L.marker([43.03409, -76.13848]);
          var moonMarker = L.marker([43.0348, -76.13635]);
          var jahnMarker = L.marker([43.03418, -76.13700]);
          var brayMarker = L.marker([43.03480, -76.13475]);
          var ilickMarker = L.marker([43.03520, -76.13560]);
          var waltersMarker = L.marker([43.03475, -76.13389]);
          var gatewayMarker = L.marker([43.0350, -76.13690]);
          var oldgreenMarker = L.marker([43.03395, -76.13475]);
          var physplMarker = L.marker([43.03385, -76.13890]);
          //var maint1Marker = L.marker([43.03390, -76.13390]);
          //var maint2Marker = L.marker([43.03418, -76.13380]);

          upgate.bindPopup("<strong>ESF Campus Entrance</strong>");
          univpolice.bindPopup("<strong>University Police</strong><br /><a target='_blank' href='http://www.esf.edu/univpolice'>Website</a>");
          oldgreenMarker.bindPopup("<strong>Old Greenhouse</strong>");
          physplMarker.bindPopup("<strong>Physical Plant</strong>");
          //maint1Marker.bindPopup("<strong>Maintenance 1</strong>");
          //maint2Marker.bindPopup("<strong>Maintenance 2</strong>");

          marshallMarker.bindPopup("<strong>Marshall Hall</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/marshall.htm'>Campus Tour</a>");
          centennialMarker.bindPopup("<strong>Centennial Hall</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/centennial.htm'>Campus Tour</a>");
          bakerMarker.bindPopup("<strong>Baker Laboratories</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/baker.htm'>Campus Tour</a>");
          moonMarker.bindPopup("<strong>F. Franklin Moon Library</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/moon.htm'>Campus Tour</a>");
          jahnMarker.bindPopup("<strong>Jahn Laboratory</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/jahn.htm'>Campus Tour</a>");
          brayMarker.bindPopup("<strong>Bray Hall</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/bray.htm'>Campus Tour</a>");
          ilickMarker.bindPopup("<strong>Illick Hall</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/illick.htm'>Campus Tour</a>");
          waltersMarker.bindPopup("<strong>Walters Hall</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/walters.htm'>Campus Tour</a>");
          gatewayMarker.bindPopup("<strong>Gateway Center</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/gateway.htm'>Campus Tour</a>");

          this.mainMarkers = L.layerGroup([upgate,univpolice, marshallMarker, centennialMarker, bakerMarker, moonMarker, jahnMarker, brayMarker, ilickMarker, waltersMarker, gatewayMarker, oldgreenMarker, physplMarker]);

          // ESF Buildings
          var marshall = L.polygon([
             [43.03428, -76.13635],
             [43.03428, -76.13595],
             [43.03429, -76.13595],
             [43.03429, -76.13577],
             [43.03428, -76.13577],
             [43.03428, -76.13541],
             [43.03409, -76.13541],
             [43.03409, -76.13559],
             [43.03411, -76.13559],
             [43.03411, -76.13582],
             [43.03409, -76.13582],
             [43.03409, -76.13573],
             [43.03389, -76.13573],
             [43.03389, -76.13603],
             [43.03409, -76.13603],
             [43.03409, -76.13594],
             [43.03411, -76.13594],
             [43.03411, -76.13617],
             [43.03409, -76.13617],
             [43.03409, -76.13634]
          ], buildingOptions)
          .bindPopup("<strong>Marshall Hall</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/marshall.htm'>Campus Tour</a>");


          var centennial = L.polygon([
             [43.03377, -76.14141],
             [43.0338, -76.14104],
             [43.03371, -76.14103],
             [43.03373, -76.14081],
             [43.03381, -76.14082],
             [43.03383, -76.14034],
             [43.03374, -76.1403],
             [43.03375, -76.1402],
             [43.03378, -76.14021],
             [43.03379, -76.14007],
             [43.03375, -76.14006],
             [43.03376, -76.13987],
             [43.0338, -76.13987],
             [43.0338, -76.13974],
             [43.03377, -76.13974],
             [43.03378, -76.13953],
             [43.03381, -76.13954],
             [43.03382, -76.13941],
             [43.03372, -76.13933],
             [43.03364, -76.13932],
             [43.03364, -76.13939],
             [43.0336, -76.13939],
             [43.0336, -76.13953],
             [43.03363, -76.13952],
             [43.03362, -76.13972],
             [43.0336, -76.13973],
             [43.03358, -76.13985],
             [43.0336, -76.13986],
             [43.03359, -76.14005],
             [43.03357, -76.14006],
             [43.03356, -76.14018],
             [43.03358, -76.14021],
             [43.03358, -76.14038],
             [43.03363, -76.14039],
             [43.03363, -76.14053],
             [43.03365, -76.14062],
             [43.03357, -76.14063],
             [43.03354, -76.14119],
             [43.03364, -76.1412],
             [43.03363, -76.14141]
          ], buildingOptions)
          .bindPopup("<strong>Centennial Hall</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/centennial.htm'>Campus Tour</a>");

          var baker = L.polygon([
             [43.03436, -76.13868],
             [43.03436, -76.1382],
             [43.03429, -76.1382],
             [43.03429, -76.13808],
             [43.03433, -76.13808],
             [43.03434, -76.13802],
             [43.03429, -76.13802],
             [43.03429, -76.13749],
             [43.03434, -76.13748],
             [43.03433, -76.13734],
             [43.0343, -76.13734],
             [43.03429, -76.13715],
             [43.03404, -76.13717],
             [43.03405, -76.13807],
             [43.0341, -76.13808],
             [43.0341, -76.13818],
             [43.03404, -76.13818],
             [43.03403, -76.13823],
             [43.03396, -76.13823],
             [43.03397, -76.13828],
             [43.03384, -76.13828],
             [43.03384, -76.1382],
             [43.03374, -76.13821],
             [43.03374, -76.13869]
          ], buildingOptions)
          .bindPopup("<strong>Baker Laboratories</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/baker.htm'>Campus Tour</a>");

          var moon = L.polygon([
             [43.03498, -76.13661],
             [43.03498, -76.13609],
             [43.03446, -76.13609],
             [43.03446, -76.13661]
          ], buildingOptions)
          .bindPopup("<strong>F. Franklin Moon Library</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/moon.htm'>Campus Tour</a>");
          var gateway = L.polygon([
             [43.03455, -76.13709],
             [43.03525, -76.1371],
             [43.0353, -76.13676],
             [43.03451, -76.13676],
             [43.03451, -76.13685],
             [43.03457, -76.13687],
             [43.03455, -76.13709]
          ], buildingOptions)
          .bindPopup("<strong>Gateway Center</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/gateway.htm'>Campus Tour</a>");

          var illick = L.polygon([
             [43.03533, -76.13648],
             [43.03533, -76.13523],
             [43.03509, -76.13523],
             [43.03509, -76.13648]
          ], buildingOptions)
          .bindPopup("<strong>Illick Hall</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/illick.htm'>Campus Tour</a>");
          var bray = L.polygon([
             [43.03508, -76.13484],
             [43.03508, -76.13457],
             [43.03432, -76.13457],
             [43.03432, -76.13484]
          ], buildingOptions)
          .bindPopup("<strong>Bray Hall</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/bray.htm'>Campus Tour</a>");

          var jahn = L.polygon([
             [43.03433, -76.13712],
             [43.03433, -76.13678],
             [43.03382, -76.13678],
             [43.03382, -76.13712]
          ], buildingOptions)
          .bindPopup("<strong>Jahn Laboratory</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/jahn.htm'>Campus Tour</a>");

          var walters = L.polygon([
             [43.03466, -76.1342],
             [43.03466, -76.134],
             [43.03493, -76.13399],
             [43.03493, -76.13372],
             [43.03446, -76.13372],
             [43.03446, -76.13383],
             [43.03429, -76.13383],
             [43.03429, -76.13424],
             [43.03429, -76.13444],
             [43.03466, -76.13444]
          ], buildingOptions)
          .bindPopup("<strong>Walters Hall</strong><br /><a target='_blank' href='http://www.esf.edu/welcome/campus/walters.htm'>Campus Tour</a>");

          var oldgreen = L.polygon([
             [43.03402, -76.13492],
             [43.03402, -76.1346],
             [43.03382, -76.1346],
             [43.03382, -76.13492]
          ], buildingOptions)

          var pplant = L.polygon([
             [43.03389, -76.1391],
             [43.0339, -76.13894],
             [43.03412, -76.13894],
             [43.03411, -76.13869],
             [43.03375, -76.13869],
             [43.03375, -76.13881],
             [43.03373, -76.13881],
             [43.03372, -76.1389],
             [43.03375, -76.13889],
             [43.03376, -76.13909]
          ], buildingOptions)

         // var maint1 = L.polygon([
         //    [43.03396, -76.13404],
         //    [43.03396, -76.13388],
         //    [43.03394, -76.13377],
         //    [43.03387, -76.13377],
         //    [43.03387, -76.13404]
         // ], buildingOptions)

        //var maint2 = L.polygon([
       //      [43.03424, -76.13386],
        //     [43.03424, -76.13376],
       //      [43.03411, -76.13376],
       //      [43.03411, -76.13386]
        //], buildingOptions);

        this.mainBldgs = L.layerGroup([bray, centennial, oldgreen, pplant, gateway, baker, jahn, illick, walters, moon, marshall]);

        // SU Buildings
        var lawrinson = L.polygon([
             [43.03485, -76.13898],
             [43.03485, -76.13865],
             [43.03462, -76.13865],
             [43.03462, -76.13898]
        ], {
             color: suFill,
             fillColor: suFill,
             fillOpacity: 0.5,
             weight: 0
        })

        var sadler = L.polygon([
             [43.0356, -76.13899],
             [43.0356, -76.13848],
             [43.03539, -76.1385],
             [43.03538, -76.13836],
             [43.03531, -76.13835],
             [43.03531, -76.13779],
             [43.03517, -76.13779],
             [43.03516, -76.13815],
             [43.03518, -76.13815],
             [43.03517, -76.13838],
             [43.03514, -76.13838],
             [43.03514, -76.13865],
             [43.03525, -76.13865],
             [43.03525, -76.139],
             [43.0354, -76.139]
        ],
        {
             color: suFill,
             fillColor: suFill,
             fillOpacity: 0.5,
             weight: 0
        })

        var dome = L.polygon([
             [43.03584, -76.13749],
             [43.03664, -76.13749],
             [43.03694, -76.13697],
             [43.03694, -76.1357],
             [43.03664, -76.13519],
             [43.03584, -76.13519],
             [43.03553, -76.13573],
             [43.03552, -76.13702]
        ],
        {
             color: suFill,
             fillColor: suFill,
             fillOpacity: 0.5,
             weight: 0
        })

        this.subldgs = L.layerGroup([lawrinson,dome,sadler]);

        // Parking Lots
        var P4 = L.polygon([
             [43.03538, -76.13635],
             [43.03538, -76.13526],
             [43.03533, -76.13526],
             [43.03533, -76.13635]
        ],
        {
             color: parkingFill,
             fillColor: parkingFill,
             fillOpacity: 0.5,
             weight: 0
        })
        .bindPopup("<strong>Parking Lot P4</strong><br />Closed for construction.");

        var centpark = L.polygon([
             [43.03381, -76.14205],
             [43.03383, -76.14147],
             [43.03348, -76.14144],
             [43.03345, -76.14203]
        ],
        {
             color: parkingFill,
             fillColor: parkingFill,
             fillOpacity: 0.5,
             weight: 0
        })
        .bindPopup("<strong>Centennial Hall Parking</strong><br />Restricted to Centennial Hall residents.");

        this.esfparking = L.layerGroup([P4,centpark]);

   }
});
