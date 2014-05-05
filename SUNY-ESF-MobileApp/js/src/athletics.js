// JavaScript Document
(function($) {
	    var AthleticsRouter = BaseRouter.extend({
        routes: {
            "athletics": "showAthletics",
        },
        showAthletics: function() {
            this.loadPage("athleticsPage", AthleticsPage);
            this.navigate("athletics", this.athleticsPage);
            $.mobile.silentScroll(0);
        },
    });

    var AthleticsPage = BaseView.extend({
        events : {
            "click a" : "linkClick"
        },
        initialize: function() {
            var html =
                "<div data-role=\"page\" id=\"esfAthletics\">" +
                " <div id = \"commonHeader\"></div>" +
                " <div data-role=\"content\">" + "</div>" +
                " <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);
            $.get("http://www.esf.edu/mobile/includes/athletics.html").done(_.bind(function(data) {
              $("#esfAthletics").find("[data-role=content]").html(data);
            }, this))
            // Error Handler function
            .fail(_.bind(function(response) {
                this.coreErrorHandler(response);
            }, this));

            this.renderHeader('ESF Athletics', '#');
            this.renderTheme();
        }
    });

    RouterManager.register({ routerClass: AthleticsRouter });

})(jQuery);