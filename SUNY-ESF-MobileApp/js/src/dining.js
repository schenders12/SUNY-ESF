// JavaScript Document
(function($) {

    var DiningRouter = BaseRouter.extend({
        routes: {
            "dining": "showDining",
        },
        showDining: function() {
            this.loadPage("diningPage", DiningPage);
            this.navigate("dining", this.diningPage);
            $.mobile.silentScroll(0);
        },
    });

    var DiningPage = BaseView.extend({
       events : {
            "click a" : "linkClick"
       },
        initialize: function() {
            var html =
                "<div data-role=\"page\" id=\"esfDining\">" +
                " <div id = \"commonHeader\"></div>" +
                " <div data-role=\"content\">" + "</div>" +
                " <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);
            $.get("http://www.esf.edu/mobile/includes/trailhead.html").done(_.bind(function(data) {
                  $("#esfDining").find("[data-role=content]").html(data);
            }, this))
            // Error Handler function
            .fail(_.bind(function(response) {
                this.coreErrorHandler(response);
            }, this));

            this.renderHeader('Dining at ESF', '#');
            this.renderTheme();
        }
    });

    RouterManager.register({ routerClass: DiningRouter });

})(jQuery);