// JavaScript Document
(function($) {
	    var GivingRouter = BaseRouter.extend({
        routes: {
            "giving": "showGiving",
        },
        showGiving: function() {
            this.loadPage("givingPage", GivingPage);
            this.navigate("giving", this.givingPage);
            $.mobile.silentScroll(0);
        },
    });

    var GivingPage = BaseView.extend({
        events : {
            "click a" : "linkClick"
        },
        initialize: function() {
            var html =
                "<div data-role=\"page\" id=\"esfGiving\">" +
                " <div id = \"commonHeader\"></div>" +
                " <div data-role=\"content\">" + "</div>" +
                " <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);
            $.get("http://www.esf.edu/mobile/includes/giving.html").done(_.bind(function(data) {
                 $("#esfGiving").find("[data-role=content]").html(data);
            }, this))
            // Error Handler function
            .fail(_.bind(function(response) {
                this.coreErrorHandler(response);
            }, this));

            this.renderHeader('Give to ESF', '#');
            this.renderTheme();
        }
    });

    RouterManager.register({ routerClass: GivingRouter });

})(jQuery);