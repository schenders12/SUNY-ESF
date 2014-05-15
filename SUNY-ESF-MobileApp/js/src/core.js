(function($) {

    // localStorage polyfill in case it's not supported
    if (!("localStorage" in window) || window.localStorage === null) {
        var Storage = {
                _data: {},
                setItem: function(id, val) {
                    return this._data[id] = String(val);
                },
                getItem: function(id) {
                    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
                },
                removeItem: function(id) {
                    return delete this._data[id];
                },
                clear: function() {
                    return this._data = {};
                }
        };
    } else {
        var Storage = window.localStorage;
    }
	
	function successHandler (result) {
			alert('nativePluginResultHandler - '+result);
				console.log('nativePluginResultHandler: '+result);

			}
        
			function errorHandler (error) {
				alert('nativePluginErrorHandler - '+error);
				console.log('nativePluginErrorHandler: '+error);
			}

    /*
     * jQuery Mobile global settings
     */
    $(document).bind("mobileinit", function() {
        $.mobile.ajaxEnabled = false;
        $.mobile.hashListeningEnabled = false;
        $.mobile.linkBindingEnabled = false;
        $.mobile.pushStateEnabled = false;
        $.mobile.autoInitializePage = false;
        $.mobile.defaultPageTransition = "none";
		$.mobile.allowCrossDomainPages = true;
		$.support.cors = true;
		//$.mobile.page.prototype.options.degradeInputs.date = true;
		
		// Hack to fix possible bug in jquery mobile 1.3.2
		// Mobile loader widget is not created properly
        $.mobile.loaderWidget = $.mobile.loaderWidget || $( $.mobile.loader.prototype.defaultHtml ).loader();
        $.mobile.loader.prototype.options.text = "ESF App loading...";
        $.mobile.loader.prototype.options.textVisible = false;
        $.mobile.loader.prototype.options.theme = "a";
        $.mobile.loader.prototype.options.html = "";
    });
    /*
     * Hide/show the page loading indicator during ajax loads
     */
    $(document).bind("ajaxStart", function() {
        //$.mobile.showPageLoadingMsg();
        $.mobile.loading('show');
    });
    $(document).bind("ajaxStop", function() {
        //$.mobile.hidePageLoadingMsg();
        $.mobile.loading('hide');
    });

    $(document).bind("deviceready", function() {
         // IOS 7 and above:  Prevent status bar from overlaying app
        if (window.device) {
           if (window.device.platform === 'iOS' && parseFloat(window.device.version) >= 7.0) {  
                StatusBar.overlaysWebView(false); //Turns off web view overlay.
                //StatusBar.backgroundColorByName( "green" ); // turn status bar green
           }
        }

        // Google analytics
       gaESF.gaStart();
       //alert("Init GA...");
       ////var gaPlugin;
	//   alert("Window.Phonegap: " + window.PhoneGap);
	//   alert("Window.cordova: " + window.cordova);
	 //  alert("Window.Cordova: " + window.Cordova);
	 //  alert("Ors " + window.PhoneGap || window.cordova || window.Cordova);
       //gaPlugin = window.plugins.gaPlugin;
      // alert("Done with init!!!");
       //gaPlugin.init(successHandler, errorHandler, "UA-5865890-4", 10);
	
        // Register for Push Notifications
        pushESF.pushStart();

    });

    $(window).bind("orientationchange", function (orientation) {

    });

	// Browser Debug - fire Device Ready/Orientation change events
    //window.setTimeout(function() {
		//alert("Device trigger....");
      // var e = document.createEvent('Events'); 
      // e.initEvent("unload"); 
      // e.initEvent("deviceready"); 
     //  e.initEvent("orientationchange"); 
      // document.dispatchEvent(e);
	   
	   //$(window).trigger('orientationchange'); // fire the orientation change event at the start, to make sure
	   
    //}, 500);



    /*
     * Shared event aggregator passed to all routers/views extending our base classes.
     * Useful for communication of events between subapps.
     */
    var EventAggr = _.extend({}, Backbone.Events);

    /*
     * Utility class shared with views providing access to theme data/settings.
     */
    ThemesUtil = _.extend({}, {
        initialize: function() {
          var loadThemeDef = $.getJSON("mobile/theme_def.json").done(_.bind(function(theme_defs) {
                // Store an unmodified copy of the upstream theme_defs
                this.orig_theme_defs = _.extend({}, theme_defs);
                // The following modifies theme_defs...so we store an unmodified copy above
                this.handleLegacyStorage(theme_defs);
                // Create new theme defs to store by overwriting the upstream with our current
                var newDefs = [];
                var currentDefs = this.getThemeDefs();
                _.each(this.orig_theme_defs, function(themeDef, index) {
                    // Find our current copy of the given theme def	
                    var currentDef = _.find(currentDefs, function(def) { return def.id === themeDef.id; });
                    if (currentDef) {
                        // Update theme with new settings
                        var copy = _.extend({}, themeDef);
                        copy.subapps = themeDef.subapps;
                        newDefs[index] = copy;
                    } else {
                        newDefs[index] = themeDef;
                    }
                }, this);
                // Merge in any upstream changes/additions w/ our local overrides
                this.setThemeDefs(newDefs);
            }, this));
            return _.extend(this, $.when(loadThemeDef).promise());
        },
        hasValidTheme: function() {
            var valid = true;
            var theme = this.getTheme();
            if (!theme) {
                valid = false;
            } else {
                var found = _.find(this.getThemeDefs(), function(def) { return def.id === theme; });
                if (!found) {
                    valid = false;
                }
            }
            return valid;
        },
        // Currently selected theme id
        getTheme: function() {
            // Theme cookie takes precedent (since it should be passed by native apps
            // or "subapps" living on different domains).
            return $.cookie("theme") || Storage.getItem("theme");
        },
        setTheme: function(theme_id) {
            // Update our cookie
            $.cookie("theme", theme_id);
            Storage.setItem("theme", theme_id);
        },
        removeTheme: function() {
            Storage.removeItem("theme");
        },
        // Theme definitions w/ local settings
        getThemeDefs: function() {
            return $.parseJSON(Storage.getItem("theme_def"));
        },
        setThemeDefs: function(theme_defs) {
            Storage.setItem("theme_def", JSON.stringify(theme_defs));

        },
        getThemeDef: function(theme_id) {
            var id = theme_id || this.getTheme();
            return _.find(this.getThemeDefs(), function(theme_def) {
                return theme_def.id === id;
            });
        },
        setThemeDef: function(theme_def) {
            var theme_defs = this.getThemeDefs();
            _.each(theme_defs, function(def, index) {
                if (def.id === theme_def.id) {
                    _.extend(theme_defs[index], theme_def);
                }
            });
            this.setThemeDefs(theme_defs);
        },
        handleLegacyStorage: function(theme_defs) {
            var storedThemeDef = this.getThemeDefs();
            // Deal with legacy storage (we used to store only the theme
            // definition for the currently selected theme)	
            if (storedThemeDef && storedThemeDef.name) {
                Storage.removeItem("theme_def");
                Storage.removeItem("theme");
                _.each(theme_defs, _.bind(function(theme_def, index) {
                    if (theme_def.name === storedThemeDef.name) {
                        // Merge our local copy over upstream copy
                        _.extend(theme_defs[index], storedThemeDef);
                        this.setTheme(theme_defs[index].id);
                        this.setThemeDefs(theme_defs);
                        storedThemeDef = theme_defs;
                    }
                }, this));
            }
        }
    });

    /*
     * Subapp routers should register with this router manager so they are
     * automagically created and their route handlers are wrapped with our
     * theming logic. This also provides a hook to load requisite data via
     * implementation of a "loadData" method called prior to each route handler.
     */
    RouterManager = {
            inits: [],
            register: function(init) {
                this.inits.push(init);
            },
            start: function() {
                /*
                 * Before we call any routes we need to make sure we have a valid theme set.
                 * If we're in native mode we expect a cookie indicating the theme to use overriding
                 * that locally stored.  If we don't have valid theme set we'll use our default.
                 */
                var routesWrapper = function(fn) {
                    //if (!ThemesUtil.hasValidTheme()) {
                        // If we're in native mode and we don't have a valid theme, either 1) the native app
                        // hasn't been updated to support theming or 2) the passed theme isn't defined in our theme
                        // definitions.  Either way, use our default theme.
                     //   if (this.nativeMode) {
                            ThemesUtil.setTheme("esfmain");
                      //      window.location.reload();
                       // }
                       // Otherwise, we want to present our users with the themes selection page.
                       // TBD
                       // else {
                        //    if (window.location.hash !== "#themes") {
                        //        window.location.hash = "#themes";
                       //         window.location.reload();
                        //        return;
                        //    }
                        //}
                   // }
                    // Grab the arguments we need to pass to our route handler
                    var args = Array.prototype.slice.call(arguments, 1);
                    // Before we call any routes, give our router a chance to load any dependent data.
                    // Implementations of loadData should return a deferred object if we should wait
                    // until data is completely loaded before calling the route.			
                    $.when(this.loadData(Backbone.history.getFragment())).then(_.bind(function() {
                        // Call our route handler
                        fn.apply(this, args);
                    }, this));
                };
                // Router initialization	
                _.each(this.inits, function(init) {
                    // Wrap each route with our...ummm...wrapper
                    _.each(init.routerClass.prototype.routes, function(route) {
                        init.routerClass.prototype[route] = _.wrap(init.routerClass.prototype[route], routesWrapper);
                    });
                    // Instantiate the router
                    var router = new init.routerClass(init.args);
                    // Bind 'this' to the router for all router functions
                    _.bindAll(router);
                });
                // Finally, initialize our themes util and, once complete, start
                // history to begin calling routes
                $.when(ThemesUtil.initialize()).then(function() {
                    Backbone.history.start({ pushState: false });
                });

            }
    };

    /*
     * Subapp routers can/should inherit from this.
     */
    BaseRouter = Backbone.Router.extend({
        // Pass a reference to our storage impl
        storage: Storage,
        // Pass our global event aggregator
        eventAggr: EventAggr,
        // Indicate whether or not we are in native mode (this cookie is
        // typically only passed by native apps)
        nativeMode: ($.cookie("app") != null ? true : false),
        // For consistency in navigation behavior calls to $.mobile.changePage
        // should pass this as the paging options
        pageOptions: {
            changeHash: false,
            replace: true
        },
        // This method is call prior to calls to our route handlers.
        // Routers should implement this, if necessary, to load any data
        // required by our pages.
        loadData: function(fragment) {},
        // Convenience method to instantiate and initialize a page, if necessary.
        // Takes a key such that the router can reference the page like 'this.key',
        // the class to instantiate and optional arguments to pass to the page's
        // initializer.
        loadPage: function(key, clazz, args) {
            if (!this[key]) {			
                var initializeWrapper = function(fn) {	
                    var args = Array.prototype.slice.call(arguments, 1);
                    // Pass a reference to our router
                    this.router = args[0].router;
                    // Bind 'this' to all page functions
                    _.bindAll(this);
                    // Initialize our page
                    fn.apply(this, args);
                    // Initialize our page container
                    // Page container will exist if this is not the first page viewed
                    if ($.mobile.pageContainer) {
                        $.mobile.pageContainer.append(this.$el);
                        this.$el.page().trigger("create");
                    } else {
                        $("body").append(this.$el);
                        $.mobile.initializePage();
                    }
                };
                clazz.prototype.initialize = _.wrap(clazz.prototype.initialize, initializeWrapper);
                this[key] = new clazz(_.extend(args || {}, { router: this }));
            }
        },
        // Override Backbone.View "navigate" method to simplify navigation for extending pages.
        // Takes as arguments the path (url fragment) to navigate to and the page to show.
        navigate: function(path, page, options) {
            // Call our "super" method
            Backbone.Router.prototype.navigate.call(this, path, options);
            var pageId = page.el.id;

            if ($.mobile.activePage && ($.mobile.activePage[0].id !== pageId)) {
                $.mobile.changePage("#" + pageId, this.pageOptions);
                // Track page view with GA
                alert("Calling gaTrackPage..." + pageId);
                gaESF.gaTrackPage(pageId);
                alert("Called gaTrackPage");
            }

        }
    });

    /*
     * Subapp pages can/should inherit from this.
     */
    BaseView = Backbone.View.extend({
      events : {
           "click #mainSite" : "linkClick",
           "click #esfFB" : "linkClick",
           "click #esfTW" : "linkClick",
           "click #esfLI" : "linkClick",
           "click #esfYT" : "linkClick",
           "click #esfWP" : "linkClick"
       },

        // Pass our global event aggregator
        eventAggr: EventAggr,
        // Utility method typically called in page initializer to decorate our page with
        // our current theme (or the default if no theme has been set)
        renderTheme: function(withLogo) {
            // It's possible we don't have a theme chosen yet.  If so, use our default
            var theme_def = ThemesUtil.getThemeDef() || ThemesUtil.getThemeDef("esfmain");
            var theme_def = ThemesUtil.getThemeDef("esfmain");
            var jqm_theme = theme_def.jqm_theme || "a";
            this.$el.attr("data-theme", jqm_theme);
            var $header = this.$("div[data-role=\"header\"]");
            // It doesn't appear that this is inherited from the page?!
            $header.attr("data-theme", jqm_theme);
            if (withLogo) {
                // Header attributes:  Image
                $($header).html("<img src=\"" + theme_def.navbar_logo_low + "\"/>");
                //$(".logo", $header).html("<img src=\"" + theme_def.navbar_logo_low + "\"/>");	
                //$header.css("background", "url(\"" + theme_def.navbar_background_low + "\") repeat-x scroll 0 0 transparent");
                //$header.css("background", "url(\"" + theme_def.navbar_background_low_dark + "\") repeat-x scroll 0 0");
                //$($header).css("background-color", theme_def.navbar_background_low_light);
                //$($header).css("background", theme_def.navbar_background_low_dark);
                // Page attributes:  gradient image
              // this.$el.css("background", theme_def.background_color_light + " url(\"images/blackfadeBG.png \") repeat-x fixed top left");
               // this.$el.css("position", "relative");
               // this.$el.css("background", theme_def.background_color + " url(\"" + theme_def.watermark_low + "\") no-repeat fixed center center");
               // this.$el.css("background", theme_def.background_color);

            }
            else {
                // Header attributes:  Background image
                $header.css("background", "url(\"" + theme_def.navbar_background_low_light + "\") repeat-x scroll 0 0");
                // $header.css("background", "url(\"" + theme_def.navbar_background_low_light + "\") ");
                // Page attributes:  Background color
                this.$el.css("background", theme_def.background_color_light);

            }
            // Set the Header text color
            $("h1", $header).css("color", theme_def.navbar_text_color);

        },
        // Call this function to use a common header (Back and Home button)
        // Override for a different header
        renderHeader: function(title, route) {
            var $header = this.$("div[id=\"commonHeader\"]");

            if (this.nativeMode) {
                headerHTML = "  <a class=\"back\" data-icon=\"back\" data-direction=\"reverse\" data-role=\"button\" href=\"" + route + "\" data-position=\"fixed\">Back</a>"
           } else {
                headerHTML = "<div data-role=\"header\" data-position=\"fixed\" data-tap-toggle=\"false\">" +
                        "   <a id=\"back\" class=\"back\" data-role=\"button\" data-inline=\"true\" data-transition=\"slide\" data-direction=\"reverse\" data-shadow=\"false\" href=\"" + route + "\">Back</a>" +	
                        "  <h1><div id = \"esfPageTitle\">" + title + "</div></h1>" + 
                        "   <a id=\"homeButton\" href=\"#\" data-role=\"button\" data-inline=\"true\" data-direction=\"reverse\" data-shadow=\"false\">Home</a>" + 
                        "</div>";
            }
            $header.html(headerHTML);
        },
        // Call this function to use a common footer (Social icon NavBar)
        // Override for a different footer
        renderFooter: function() {
               var $footer = this.$("div[id=\"commonFooter\"]");
               var footerHTML =
                        "  <div data-role=\"footer\" data-position=\"fixed\" data-tap-toggle=\"false\" class=\"esfFooter\">" +
                       // "  <div id = \"homeImg\" style=\"text-align:center;border:none\"><img src = \"images/homelogo.png\"></div>" +
                        "  <div data-role=\"navbar\" class=\"esfFooter\">" + 
                        "     <ul id=\"commonFooterNavbar\">" + 
                        "       <li><a href=\"http://www.facebook.com/sunyesf/\" id=\"esfFB\" data-icon=\"custom\" data-corners=\"true\"></a></li>" + 
                        "       <li><a href=\"https://twitter.com/sunyesf\" id=\"esfTW\" data-icon=\"custom\"></a></li>" +
                        "       <li><a href=\"https://touch.www.linkedin.com/#group/1782788\" id=\"esfLI\" data-icon=\"custom\"></a></li>" +
                        "       <li><a href=\"http://www.youtube.com/user/SUNYESFVIDEO\" id=\"esfYT\" data-icon=\"custom\"></a></li>" +
                        "       <li><a href=\"http://sunyesf.wordpress.com/\" id=\"esfWP\" data-icon=\"custom\"></a></li>" +
                       // "       <li><a href=\"http://deimos3.apple.com/WebObjects/Core.woa/Browse/esf.edu\" id=\"esfIT\" data-icon=\"custom\"></a></li>" +
                        "   </ul>" +
                        "</div>" +
                        "</div>";
            $footer.html(footerHTML);
        },
        // Common function to open an external URL using PhoneGap InApp Browser
        launchURL: function(title, url, target) {
            try {
               var iabRef = window.open(url, target, "location=yes,toolbar=yes,closebuttoncaption=Back,toolbarposition=top,transitionstyle=fliphorizontal,enableViewportScale=yes");

               iabRef.addEventListener('loadstart', function(event) { 

               });
               iabRef.addEventListener('loadstop', function(event) { 

               });
               iabRef.addEventListener("exit", function(event) { 
                   if (iabRef) {
                    iabRef.removeEventListener('loadstart');
                    iabRef.removeEventListener('loadstop');
                    iabRef.removeEventListener('exit');
                    iabRef.close();
                    iabRef = null;
                   } 
               });
            } catch (e) {
                 alert(e);
            }
        },
        // Common function to intercept link clicks and prevent default change of page
        linkClick: function(e) {
            var id = arguments[0].currentTarget.id;
            if ((id == 'back') || (id=='homeButton')) {
               // Ignore this click
            }
            else {
               e.preventDefault();
               var target=$(e.target).data('target');
               var target2=$(this).data('target');
               // If there is no target defined on the element, use _blank
               // ex:  data-target=\"_blank\"
              if(typeof target == 'undefined') {
                  target = '_blank';
              }
               var href = arguments[0].currentTarget.href;
               this.launchURL('ESF External Link' , href, target);
            }
        },
        coreErrorHandler:  function(response) {
            if (response.status == 500) {
               alert("Internal ESF Server Error, please try your request later");
            } else if (response.status == 503){
               alert("The ESF Server is unavilable, please try your request later");
            } else if (response.status == 408){
               alert("ESF Server timed out, please try your request later");
            } else{
               alert("Unknown error, please try your request later");
            }
        },
    });

    // Start our router manager once the document is ready.
    $(document).ready(function() {
        RouterManager.start();
    });
    
    // Hack to bypass webkit page cache (which breaks our script)
    // See http://stackoverflow.com/questions/158319/cross-browser-onload-event-and-the-back-button
    $(window).unload(function() {});

})(jQuery);
