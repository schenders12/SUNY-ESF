// JavaScript Document
(function($) {

    var MapsRouter = BaseRouter.extend({
        routes: {
            "maps": "showMapChoice",
            "maps/show/:mapID": "showMap",
        },
        initialize: function() {
            if (!this.MapModels) {
              this.MapModels = new MapModelCollection();
            }
        },
        showMap: function(mapID) {
            this.loadPage("mapsPage", MapsPage, {id : mapID});
            this.mapsPage.id = mapID;
            this.navigate("maps/show/" + this.mapsPage.id, this.mapsPage);
            $.mobile.silentScroll(0);
        },
        showMapChoice: function() {
            this.loadPage("mapChoicePage", MapChoicePage, {});
            this.navigate("maps", this.mapChoicePage);
            $.mobile.silentScroll(0);
        },
    });

    var MapsPage = BaseView.extend({
       events : {
            "pageinit":  "initMap",
            "pagebeforeshow": "showMap",
            "pagebeforehide": "hideMap",
            "click a" : "linkClick"
       },
       hideMap : function(){
           // Remove layers
            this.mapModel.removeLayers(this.map);
       },
       resizeMap : function(){
           this.map.invalidateSize();
       },
       // showMap:  Called when user selects a map
       showMap : function(){
            // Get the map model
            this.mapModel = this.router.MapModels.get(this.id);

            // Center the map on the lat/long
            this.initLat = this.mapModel.get('lat');
            this.initLong = this.mapModel.get('long');
            this.initMapZoom = this.mapModel.get('zoom');
            var latlng = L.latLng(this.initLat, this.initLong);
            this.map.setView(latlng, this.initMapZoom);

            // Get user's location
            this.map.locate({setView: false, maxZoom: 17});
            this.map.on('locationfound', this.onLocationFound);

            // Add layers
            this.mapModel.addLayers(this.map);

            // Resize the map for proper rendering
            setTimeout(this.resizeMap, 1000);
       },
       // Initialize:  Create page HTML
       initialize: function(options) {
            this.map = null;
            this.id = options.id;
            var html =
                "<div data-role=\"page\" id=\"esfMaps\" data-theme=\"c\">" + 
                " <div id = \"commonHeader\"></div>" + 
                " <div data-role=\"content\"></div>" +
                "<div id=\"map_canvas\" style=\"width:100%; height:100%; min-height:280px; position:absolute;\">" +
                " </div>" +
                "</div>";
            this.setElement(html);

            this.renderHeader('ESF Maps', '#maps');
            this.renderTheme();

            setTimeout(_.bind(this.resizeMap, this), 1000);

        },

       // InitMap - Create map and add tile layer/zoom control.
       // Called during Page Init event.
       initMap: function() {
               // Create the map
               this.map = L.map('map_canvas', {
                 zoomControl:false,
                 center: new L.LatLng(40.65,-73.95),
                 zoom: 20,
                 animate:  true
               });
               // Add  tile layer
               L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://openstreetmap.org">Open Street Map</a>',
                  maxZoom: 28
               }).addTo(this.map);

               // Add a zoom control manually to bottom right
               var zoomControl = L.control.zoom({
                 position: 'bottomright',
               });
               this.map.addControl(zoomControl);

               this.map.invalidateSize();

        }

    });

    var MapChoicePage = BaseView.extend({
       initialize: function(options) {
            var html =
                "<div data-role=\"page\" id=\"esfMapChoice\">" +
                " <div id = \"commonHeader\"></div>" +
                " <div data-role=\"content\">" +
                "    <ul data-role=\"listview\" id=\"eventChoice\" data-inset=\"true\" class=\"esf_ListChoice\">" +
                "      <li id=\"esfMainMap\"><a href=\"#maps/show/main\"><h4>Main ESF Campus</h4></a></li>" +
                //"      <li id=\"esfMainMap\"><a href=\"#maps/show/mobileMaps.asp\">Main ESF Campus</a></li>" +
                "      <li id=\"esfRangerMap\"><a href=\"#maps/show/ranger\"><h4>Ranger School</h4></a></li>" +
                "      <li id=\"esfNewcombMap\"><a href=\"#maps/show/newcomb\"><h4>Newcomb Campus</h4></a></li>" +
                //"      <li id=\"esfCranberryMap\"><a href=\"#maps/show/cranberry\"><h4>Cranberry Lake</h4></a></li>" +
                "      <li id=\"esfThousandMap\"><a href=\"#maps/show/thousand\"><h4>Thousand Islands Biological Station</h4></a></li>" +
                "    </ul>" + 
                "  </div>" +
                "  <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);

            this.renderHeader('ESF Maps', '#');
            this.renderTheme();

        }
    });

    var MapModelCollection = Backbone.Collection.extend({
        initialize:   function(){
           this.add(new MainMapModel());
           this.add(new RangerMapModel());
           this.add(new NewcombMapModel());
          // this.add(new CranberryMapModel());
           this.add(new ThousandMapModel());
        },
    });

    RouterManager.register({ routerClass: MapsRouter });

})(jQuery);

// Reference only - ESF Main campus Google map
//<iframe src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d2916.417723348168!2d-76.1314063293304!3d43.032641798096236!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1395760033441" width="600" height="450" frameborder="0" style="border:0"></iframe>
