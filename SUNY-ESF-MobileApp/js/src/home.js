// JavaScript Document
(function($) {

    var HomeRouter = BaseRouter.extend({
        routes: {
            "": "showHome",
            "settings": "showSettings",
        },
        loadData: function() {
            if (!this.app_def) {
                var deferred = new $.Deferred();
                $.getJSON("mobile/app_def.json").done(_.bind(function(app_def) {
                    this.app_def = app_def;
                    deferred.resolve();
                }, this));
                return deferred.promise();
            }
        },
        showHome: function() {
            this.loadPage("homePage", HomePage);
            this.navigate("", this.homePage);
        },
        showSettings: function() {
            this.loadPage("settingsPage", SettingsPage);
            this.navigate("settings", this.settingsPage);
        }
    });

    var HomePage = BaseView.extend({
        initialize: function(options) {
            var header = "";
            if (!this.router.nativeMode) {
                header +=
                    "  <div data-role=\"header\" data-position=\"fixed\" data-tap-toggle=\"false\">" +
                    "    <div class=\"logo\"></div>" +
                    // TBD - add Gear button for setting theme
                    //  "    <a href=\"#settings\" data-role=\"button\" data-iconpos=\"notext\" data-icon=\"gear\" class=\"ui-btn-right\">Settings</a>" +
                    "  </div>";
            }
            var html =
                "<div id=\"home\" data-role=\"page\">" + header +
                //"  <div id=\"homebuttonGrid\" data-role=\"content\"></div>" +
                "  <div id=\"homebuttonGrid\" class=\"ui-content\" role=\"main\"></div>" +
                //"  <img src = \"images/homelogo.png\" style=\"position:absolute;bottom:0; width:300px; height:60px; left:50%; margin-bottom: 72px;margin-left: -150px\">" + 
               // "  <img src = \"images/homelogo.png\" style=\"bottom: 45; width: 300px; position: absolute\">" + 
                //"  <img src = \"images/homelogo.png\" class=\"homeImg\">" + 
                "  <div id=  \"commonImg\" class=\"homeImg\"></div>" + 
                "  <div id = \"commonFooter\"></div>" +
                "</div>";

            this.setElement(html);
            this.renderFooter();
            this.renderTheme(true);
            this.$el.bind("pageinit", _.bind(function() {
                this.render();
            }, this));
            this.$el.bind("pagecontainerbeforeshow", _.bind(function() {
                this.render();
            }, this));
            this.eventAggr.bind("subapp.update", this.render);
        },
        render: function () {
            var theme_def = ThemesUtil.getThemeDef();
            var html ="";
            _.each(this.router.app_def, _.bind(function(subapp_def) {
                if (_.contains(theme_def.subapps, subapp_def.id)) {
                    //html += "<a href=\"" + subapp_def.entry_url + "\" data-transition=\"slideup\" style=\"text-decoration: none\"> <img src=\"" + subapp_def.icon_low + "\" /></a>";
                    //html += "<a href=\"" + subapp_def.entry_url + "\" data-transition=\"slideup\" style=\"text-decoration: none\"> <img src=\"" + subapp_def.icon_low + "\" /></a>";
                    html += "<a href=\"" + subapp_def.entry_url + "\" id=" + subapp_def.entry_url + " data-transition=\"slideup\" style=\"text-decoration: none\" data-buttonid=" + subapp_def.id + "> <img src=\"" + subapp_def.icon_low + "\" /></a>";
                }
            }, this));
            // Add Main Site button
            html += "<a href=\"http://www.esf.edu\" id=mainSite data-target=\"_blank\" data-transition=\"slideup\" style=\"text-decoration: none\"> <img src=\"images/main-site_icon.png\" /></a></div>";

            this.$("#homebuttonGrid").html(html);
        },
    });

    var SettingsPage = BaseView.extend({
        events: {
            "change select": "selectApp",
            "tap #reset": "resetDefaults"
        },
        initialize: function(options) {
            var header = "";
            if (!this.router.nativeMode) {
                header +=
                    "  <div data-role=\"header\">" +
                    "    <a href=\"#\" data-icon=\"home\" data-iconpos=\"notext\" data-role=\"button\">Home</a>" +
                    "    <h1>Settings</h1>" +
                    "  </div>";
            }
            var html = 
                "<div id=\"settings\" data-role=\"page\" >" + header +
                "  <div id=\"content\" data-role=\"content\">" +
                "    <a href=\"#themes\" data-role=\"button\" >Select a different theme</a>" +
                "    <div id=\"subapps\"></div>" +
                "    <a id=\"reset\" href=\"#settings\" data-role=\"button\" >Reset default configuration</a>" +
                "    <a href=\"#\" data-role=\"button\" data-icon=\"back\" >Finished</a>" +
                "  </div>" +
                "</div>";
            this.setElement(html);
            this.renderTheme();
            this.$el.bind("pageinit", _.bind(function() {
                this.render();
            }, this));
        },
        render: function() {
            var s = ThemesUtil.getThemeDef().subapps;
            var $subapps = this.$("#subapps").empty();
            var sortedDefs = _.sortBy(this.router.app_def, function(def) {
                return def.name;
            });
            _.each(sortedDefs, function(def) {
                var selected = _.contains(s, def.id);
                var html = 
                    "<div class=\"slidercontainer\" data-role=\"fieldcontain\">" +
                    "  <label for=\"" + def.id + "\">" + def.name + "</label>" +
                    "  <select name=\"" + def.id + "\" id=\"" + def.id + "\" data-mini=\"true\" data-role=\"slider\" >" +
                    "    <option value=\"off\">Off</option>" +
                    "    <option value=\"on\">On</option>" + 
                    "  </select>" +
                    "</div>";
                var $container = $(html).fieldcontain();
                $("select", $container).slider();
                $subapps.append($container);
            });
            this.updateSelections();
        },
        updateSelections: function() {
            var theme_def = ThemesUtil.getThemeDef();
            var s = theme_def.subapps;
            _.each(this.router.app_def, _.bind(function(def) {
                var selected = _.contains(s, def.id);
                var $select = this.$("#" + def.id);
                if (selected) {
                    $select[0].selectedIndex = 1;
                } else {
                    $select[0].selectedIndex = 0;
                }
                $select.slider("refresh");
            }, this));
        },
        selectApp: function(e) {
            var $this = $(e.currentTarget);
            var theme_def = ThemesUtil.getThemeDef();
            var id = $this.attr('name');
            switch ($this.val()) {
                case "on":
                    if (!_.contains(theme_def.subapps, id)) {
                        theme_def.subapps.push(id);
                    }
                    break;
                case "off":
                    theme_def.subapps = _.without(theme_def.subapps, id);
                    break;
            }
            ThemesUtil.setThemeDef(theme_def);
            this.eventAggr.trigger("subapp.update");
        },
        resetDefaults: function(e) {
            var theme_id = ThemesUtil.getTheme();
            var orig_theme_def = _.find(ThemesUtil.orig_theme_defs, function(def) {
                return def.id == theme_id;
            });
            ThemesUtil.setThemeDef(orig_theme_def);
            this.updateSelections();
            this.eventAggr.trigger("subapp.update");
        }
    });

    RouterManager.register({ routerClass: HomeRouter });

})(jQuery);