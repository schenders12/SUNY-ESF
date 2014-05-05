// JavaScript Document
(function($) {
    var SocialRouter = BaseRouter.extend({
        routes: {
            "social": "showSocial",
        },
        showSocial: function() {
            this.loadPage("socialPage", SocialPage);
            this.navigate("social", this.socialPage, {trigger: true, replace: true});
            $.mobile.silentScroll(0);
        },

    });

    var SocialPage = BaseView.extend({
       events : {
            "click a" : "linkClick"
       },
        initialize: function() {

            var html =
                "<div data-role=\"page\" class=\"news_ListItem2\" id=\"esfSocialGridList\">" +
                " <div id = \"commonHeader\"></div>" +
                " <div data-role=\"content\">" +
                "    <ul data-role=\"listview\" id=\"esfSocialList\">" + 
                "    </ul>" +
                "  </div>" +
                "  <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);

            // Get Video
            $.getJSON("http://www.esf.edu/mobile/mobileSocial.asp").done(_.bind(function(data) {
                 var $list = this.$("#esfSocialList");
                 _.each(data, function(social, index) {
                    var socialInfo = "<li class=\"news_ListItem2\"  data-icon=\"false\">" + 
                                     "<a href=\"" + social.URL+ "\" data-target=\"_blank\">" + 
                                     "<img src=" + social.image + " class=\"ui-li-icon\">" + 
                                     " <h3  class=\"darkblue\" style=\"margin-left:20px; margin-top:10px\">"+ social.title + "</h3>" + 
                                     "</a></li>";
                     $list.append(socialInfo);
                }, this);
                $list.listview("refresh");
            }, this))
            // Error Handler function
            .fail(_.bind(function(response) {
                this.coreErrorHandler(response);
            }, this));

            this.renderHeader('ESF Social', '#');
            this.renderTheme();
        }
    });

    RouterManager.register({ routerClass: SocialRouter });

})(jQuery);