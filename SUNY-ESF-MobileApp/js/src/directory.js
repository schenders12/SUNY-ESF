// JavaScript Document
(function($) {

    var text = {
            info: {
                noResults: "No matching results were found.",
                noPerson: "No individual matching the specified email was found for this search.",
            },
            error: {
                depts: "There was an error loading this information.  " +
                "Please try your request later"
            }
    };

    var DirectoryRouter = BaseRouter.extend({
        routes: {
            "directory": "showForm",
            "directory/search/:param/:value": "showResults",
            "directory/search/:param/:value/:email": "showPerson",
        },
        initialize: function(options) {
            this.serviceRoot = options.serviceRoot || "/rest/directory";
            this.maxHistory = options.maxHistory || 100;
            this.autocomplete = options.autocomplete;
            this.results = [];
        },
        getParam: function(name) {
           // return _.find(this.params, function(param) {
            //    return param.name === name;
           // });            
        },
        showForm: function() {
            this.loadPage("searchPage", SearchPage);
            this.navigate("directory", this.searchPage);
            $.mobile.silentScroll(0);
        },
        showResults: function(paramName, value) {
            this.loadPage("resultsPage", ResultsPage);
                $.when(this._doSearch(paramName, value)).done(_.bind(function(people) {
                   var path = "directory/search/" + paramName + "/" + encodeURIComponent(value);
                   //var path = "directory/search/" + paramName + "/" + value;
                   this.resultsPage.render(people, path, true);
                    this.navigate(path, this.resultsPage);
                }, this));
        },
        showPerson: function(paramName, value, email) {
          value = decodeURIComponent(value);
          email = decodeURIComponent(email);
           this.loadPage("personPage", PersonPage);
                $.when(this._doSearch(paramName, value)).done(_.bind(function(people) {
                    var person = this._getPerson(people, email);
                    if (!person) {
                        this.searchPage.message.infoMessage(text.info.noPerson);
                        this.showForm();
                    } else {
                        // Try to add this person to our history
                        var searchPath = "directory/search/" + paramName + "/" + encodeURIComponent(value);
                        this.personPage.render(person, searchPath);
                        this.navigate(searchPath + "/" + encodeURIComponent(email), this.personPage);
                    }
                }, this));
        },

        _doSearch: function(paramName, value) {
            var data = {};
            data[paramName] = value;
            var result = this.results[paramName + value];
            if (!result) {
                var successFilter = function(data) { return data.People; };
                var successHandler = _.bind(function(people) {
                    this.results[paramName + value] = people.People;
                }, this);
                var errorHandler = _.bind(function(response) {
                    if (response.status !== 404) {
                        this.searchPage.message.infoMessage(text.info.noResults);
                    } else {
                        this.searchPage.message.infoMessage(text.info.noResults);
                    }
                    this.showForm();
                }, this);

                var JSONcommand = "http://www.esf.edu/mobile/mobileSearch.asp?" + paramName + "=" + value;
                result =  $.getJSON(JSONcommand)
                .done(successHandler)
                .fail(errorHandler);
            }
            return result;
        },
        _getPerson: function(people, email) {
            return _.find(people, function(person) {
                return person.EmailId === email;
            });
        }
    });

    var Message = BaseView.extend({
        events: {
            "tap": "handleClose"
        },
        errorMessage: function(message) {
            this.$el.buttonMarkup({
                "icon": "alert",
                "theme": "e"
            });
            this.$(".ui-btn-text").html(message);
            this.$el.show();
            $(window).trigger("resize");
        },
        infoMessage: function(message) {
            this.$el.buttonMarkup({
                "icon": "info",
                "theme": "d"
            });
            this.$(".ui-btn-text").html(message);
            this.$el.show();
            $(window).trigger("resize");
        },
        clearMessage: function() {
            $(window).trigger("resize");
            this.$el.hide();
        },
        handleClose: function(e) {
            this.clearMessage();
            e.preventDefault();
        }
    });

    var SearchPage = BaseView.extend({
        events: {
            "submit form": "submit",
            "change select": "selectChange",
            "tap a.ui-input-clear": "clearSearch",
        },
        initialize: function(options) {
            var html = 
                "<div data-role=\"page\"  data-url=\"search\" id=\"search\">" +
                " <div id = \"commonHeader\"></div>" + 
                "  <div data-role=\"content\">" +
                "    <form data-ajax=\"false\">" +
                "      <fieldset data-role=\"controlgroup\">" +
                "      <legend>Search ESF people by:</legend>" +
                "      <input type=\"radio\" name=\"rbnNumber\" id=\"radio-choice-1\" data-inline=\"true\" value=\"LastName\" checked=\"checked\" />" +
                "      <label for=\"radio-choice-1\">Last Name</label>" +
                "      <input type=\"radio\" name=\"rbnNumber\" id=\"radio-choice-2\" data-inline=\"true\" value=\"FirstName\"  />" +
                "      <label for=\"radio-choice-2\">First Name</label>" +
                "      <input type=\"radio\" name=\"rbnNumber\" id=\"radio-choice-3\" data-inline=\"true\" value=\"Building\"  />" +
                "      <label for=\"radio-choice-3\">Building</label>" +
                "      <input type=\"radio\" name=\"rbnNumber\" id=\"radio-choice-4\" data-inline=\"true\" value=\"Office\"  />" +
                "      <label for=\"radio-choice-4\">Office, Unit, Dept</label>" +

                // "        <label for=\"paramSelect\">Search ESF people by</label>" +
                //"        <select id=\"paramSelect\" data-native-menu=\"false\">" +
                //"        <option value=\"LastName\">Last Name</option>" +
                // "        <option value=\"FirstName\">First Name</option>" +
                //"        <option value=\"Building\">Building</option>" +
                // "        <option value=\"Office\">Office, Unit, Dept</option>" +
                //"      </select>" +
                "      </fieldset>" +
                "      <fieldset data-role=\"fieldcontain\">" +
                "        <label for=\"searchValue\">Search for:</label>" +
                "        <input type=\"search\" id=\"searchValue\" name=\"searchValue\" autocomplete=\"off\"/>" +
                (this.router.autocomplete ? "        <ul id=\"autocomplete\" class=\"ui-listview ui-listview-inset ui-corner-all ui-shadow\" data-inset=\"true\" data-role=\"listview\"></ul>" : "") +
                "      </fieldset>" +
                "      <fieldset data-role=\"fieldcontain\">" +
                "        <input type=\"submit\" data-inline=\"true\" value=\"Search\"/>" +
                "      </fieldset>" +
                "    </form>" +
                "  </div>" +
                "  <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);

            this.message = new Message({
                tagName: "a",
                className: "message",
                attributes: {
                    "href": "#",
                    "style": "display: none;",
                    "data-role": "button"
                }
            });
            _.bindAll(this.message);

            this.$("div[data-role=\"content\"]").prepend(this.message.$el);

            var resizeHandler = _.bind(function() {
                if ($.mobile.activePage && ($.mobile.activePage[0].id === this.el.id)) {
                    var offset = this.$("#searchValue").offset().top;
                    var height = $(window).height();
                    var computed = offset + height;
                    this.$el.height(computed);
                }
            }, this);
            // Deal with window resize event to fix our page size for our silent scroll hack
            $(window).bind("resize", resizeHandler);

            this.renderHeader('Find People', '#');
            this.renderTheme();

           // this.$el.bind("pageshow", resizeHandler);
            this.$el.bind("pagecontainershow", resizeHandler);

        },
        submit: function(e) {
            // Called when 'Search' button is selected
            var selValue = $('input[name=rbnNumber]:checked').val(); 
           // this.router.showResults(this.$("select").val(), $.trim(this.$("#searchValue").val()));
            this.router.showResults(this.$('input[name=rbnNumber]:checked').val(), $.trim(this.$("#searchValue").val()));
            return false;
        },
        renderAutocomplete: function() {
            // Initialize the autocomplete plugin on our currently selected parameter.
            // If our autocomplete values have not loaded yet, bind to our autocompletesLoaded event and update
            var name = this.$("select").val();
            var param = this.router.getParam(name);
            this.$("#searchValue").autocomplete({
                target: this.$("#autocomplete"),
                source: param.autocomplete || [],
                link: "#directory/search/" + param.name + "/",
                minLength: 2
            });
            if (!param.autocomplete) {
                this.eventAggr.bind("autocompletesLoaded", _.bind(function() {
                    var name = this.$("select").val();
                    var param = this.router.getParam(name);
                    this._updateAutocomplete(param);
                }, this));
            }
        },
        selectChange: function(e) {
            // Called when search criteria has changed
            this.message.clearMessage();
            var name = e.currentTarget.value;
            var param = this.router.getParam(name);
        },
        clearSearch: function() {
            if (this.router.autocomplete) {
                this.$("#searchValue").autocomplete("clear");
            }
        },
        scrollToCompletions: function() {
            $.mobile.silentScroll(this.$("#searchValue").offset().top);
        },
        update: function(paramName, value) {
            var param = this.router.getParam(paramName);
            this.$("select").val(paramName).selectmenu("refresh");
            this.$("#searchValue").val(value).attr("maxlength", param.maxLength);
            if (this.router.autocomplete && param.autocomplete) {
                this._updateAutocomplete(param);
            }
        },
        _updateAutocomplete: function(param) {
            this.$("#searchValue").autocomplete("update", {
                source: param.autocomplete,
                link: "#directory/search/" + param.name + "/"
            });
        }
    });

    var BaseResults = BaseView.extend({
        render: function(people, path, showCount) {
            var $list = this.$("#esfDirResults");
            $list.empty();
            if (showCount) {
                // Add a results counter
                $list.append("<li data-role\"list-divider\">Search returned " + people.length + " result" + ((people.length > 1) ? "s" : "") + ".</li>");
            }
            _.each(people, _.bind(function(person) {
                // Create the alphabet divider
                var dividerName = person.LastName.charAt(0).toUpperCase();
                var $divider = $("." + dividerName, $list);
                if (!$divider || !$divider.length) {
                    $divider = $("<li class=\"" + dividerName + "\" data-role=\"list-divider\">" + dividerName + "</li>");
                    $list.append($divider);
                }
                // Create routes to the person page for each search result and append to listview
                var personUrl = path + "/" + encodeURIComponent(person.EmailId);
                $list.append("<li class=\"personLink\"><a href=\"#" + personUrl + "\">" + person.LastName + ", " + person.FirstName + "</a></li>");
            }, this));

            // Refresh listview
            $list.listview("refresh");
        }
    });

    var ResultsPage = BaseResults.extend({
        initialize: function(options) {
            var html =
                "<div data-role=\"page\" data-url=\"results\" id=\"results\">" +
                " <div id = \"commonHeader\"></div>" + 
                "  <div data-role=\"content\">" +
                "    <ul data-role=\"listview\" data-filter=\"true\" id=\"esfDirResults\"></ul>" +
                "  </div>" +
                " <div id = \"commonFooter\"></div>" +
                "</div>";

            this.setElement(html);
            this.renderHeader('ESF Directory Search Results', '#directory');
            this.renderTheme();
        }

    });

    var PersonPage = BaseView.extend({
        events: {
        },
        initialize: function(options) {
            var html =
                "<div class=\"vcard\" data-role=\"page\"  data-url=\"person\" id=\"person\">" +
                " <div id = \"commonHeader\"></div>" + 
                "  <div data-role=\"content\"></div>" + 
                " <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);

            this.renderHeader('', '#');
            this.renderTheme();
        },
        render: function(person, basePath) {
            var name;
            // If we're not being called by a native app we'll have a header
            if (!this.router.nativeMode) {
                name = "";
                var $header = this.$("div[data-role=\"header\"] h1");
                $header.addClass("fn").html(person.FirstName + " " + person.LastName);
            }
            // otherwise show a name attribute
            else {
                name =
                    "<div class=\"attribute fn\">" +
                    "  <span class=\"label\">Name</span>" +
                    "  <span class=\"value\">" + person.FirstName + " " + person.LastName + "</span>" +
                    "</div>";
            }
            var $content = this.$("div[data-role=\"content\"]");
            var html = 
                "<div class=\"person\">" + name +
                "  <div class=\"attribute tel\">" +
                "    <span class=\"type\" style=\"display: none;\">work</span>" +
                "    <span class=\"label\">Phone:  </span>" +
                "    <span class=\"value\">" +
                (person.OffcPhone ? "<a href=\"tel:" + person.OffcPhone + "\">" + person.OffcPhone + "</a>" : "NA") +
                "    </span>" +
                "  </div>" +
                "  <div class=\"attribute\"><span class=\"label\">Email:  </span>" +
                "    <span class=\"value\">" + 
                (person.EmailId ? "<a class=\"email\" href=\"mailto:" + person.EmailId + "\">" + person.EmailId + "</a>" : "NA") + 
                "    </span>" +
                "  </div>" +
                "  <div class=\"attribute\"><span class=\"label\">Title:  </span><span class=\"value title\">" + (person.CampusTitle || "NA" ) + "</span></div>" +
                "  <div class=\"attribute\"><span class=\"label\">Department:  </span><span class=\"value\">" + (person.WorkLoc || "NA") + "</span></div>" +
                "  <div class=\"attribute adr\"><span class=\"label\">Office:  </span><span class=\"value street-address\">" + (person.OffcRoom || "NA") + " " + (person.OffcBldg || "NA") + "</span></div>" +
                "  <div class=\"attribute mail\"><span class=\"label\">Mail:  </span><span class=\"value street-address\">" + (person.MailAddrRoom || "NA") + " " + (person.MailAddrBldg || "NA") +"</span></div>" +				
                "</div>";
            $content.html(html);

            // Update back link
            this.$("a.back").attr({ "href": "#" + basePath });
        },
    });

    RouterManager.register({
        routerClass: DirectoryRouter,
        args: {
            serviceRoot: "http://www.esf.edu/help/mobileSearch.asp",
            autocomplete: true
        }
    });

})(jQuery);