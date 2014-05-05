// JavaScript Document
(function($) {

    var VideoRouter = BaseRouter.extend({
        routes: {
            "video": "showVideoGridList",
        },
        initialize: function() {
        },
        loadData: function() {
        },
        showVideoGridList: function() {
            this.loadPage("videoGridListPage", VideoGridListPage, {collection: this.videoGridList});
            this.navigate("video", this.videoGridListPage);
            $.mobile.silentScroll(0);
        }
    });

    var VideoGridListPage = BaseView.extend({
       events : {
            "click a" : "linkClick"
       },
       initialize: function(options) {
            var html =
                "<div data-role=\"page\" id=\"esfVideoGridList\">" +
                " <div id = \"commonHeader\"></div>" +
                " <div data-role=\"content\">" +
                "   <ul data-role=\"listview\" id=\"esfVideoList\" data-inset=\"true\" data-target=\"_self\" class=\"esf_ListChoice\"></ul>" +
                "  </div>" +
                "  <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);

            // Get Video
            $.getJSON("http://www.esf.edu/mobile/mobileVideo.asp").done(_.bind(function(data) {
                 var $list = this.$("#esfVideoList");
                 _.each(data, function(video, index) {
                    var videoInfo = "<li>" +
                                    "<a href=\"https://www.youtube.com/playlist?list=" + video.playlistID + "\"><h4>"+
                                    video.title + "</h4></a></li>";
                     $list.append(videoInfo);
                }, this);
                $list.listview("refresh");
            }, this))
            // Error Handler function
            .fail(_.bind(function(response) {
                this.coreErrorHandler(response);
            }, this));

            this.renderHeader('ESF Video', '#');
            this.renderTheme();
        },
    });

    RouterManager.register({ routerClass: VideoRouter });

})(jQuery);