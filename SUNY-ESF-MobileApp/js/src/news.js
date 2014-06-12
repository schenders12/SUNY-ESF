// JavaScript Document
(function($) {
    var NewsRouter = BaseRouter.extend({
        routes: {
            "news": "showNewsList",
            "news/detail/:newsID": "showNewsDetail"
        },
        showNewsList: function() {
            this.loadPage("newsListPage", NewsPage, {collection: this.newsList});
            this.navigate("news", this.newsListPage);
            $.mobile.silentScroll(0);
        },
        showNewsDetail: function(newsID) {
            this.loadPage("newsDetailPage", NewsDetailPage, {id: newsID});
            // Update the news article ID
            this.newsDetailPage.id = newsID;
            this.navigate("news/detail/" + newsID, this.newsDetailPage);
            $.mobile.silentScroll(0);
        },
    });

    var NewsPage = BaseView.extend({
        events : {
            "click a" : "linkClick",
        },
       initialize: function(options) {
            // Initialize page HTML
            var html =
                "<div data-role=\"page\" id=\"esfNews\" data-theme=\"c\">" +
                " <div id = \"commonHeader\"></div>" +
                " <div data-role=\"content\">" +
                "   <ul data-role=\"listview\" id=\"esfHeadlineNews\"></ul>" +
                "  </div>" +
                "  <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);

            this.renderHeader('ESF News', '#');
            this.renderTheme();

            this.$el.bind("pagebeforeshow", _.bind(function () {
                this.render();
            }, this));
        },
        render: function () {
            // Get News
            $.getJSON("http://www.esf.edu/mobile/mobileNews.asp").done(_.bind(function(data) {
                var $list = this.$("#esfHeadlineNews");
                _.each(data, function(news, index) {
                    // Limit News Short to 200 characters
                    if (news.newsShort)  {
                       newsShortShort = (news.newsShort.length >= 200) ? news.newsShort.substr(0, 200) + ' ...' : news.newsShort;
                    }
                    else {
                       newsShortShort = '';
                    }
                    // Create list item for each news article
                    var newsInfo = "<li class=\"news_ListItem2\" data-icon=\"false\">" +
                                   " <img src= \"" + news.PhotoFile + "\" />" +
                                   "<a href=\"#news/detail/" + news.newsID + "\">" +
                                   "<h3 class=\"darkblue\">" + news.newsHeadline + "</h3>" +
                                   "<p>" + news.shDat + " - " + newsShortShort + "</p>" +
                                   "</a>" +
                                   "</li>";

                    $list.append(newsInfo);
                }, this);
                $list.listview("refresh");
            }, this))
            // Error Handler function
            .fail(_.bind(function(response) {
                this.coreErrorHandler(response);
            }, this));
        }
    });

    var NewsDetailPage = BaseView.extend({
        events : {
            "click a" : "linkClick"
        },
        initialize: function(options) {
            var html =
                "<div data-role=\"page\" id=\"esfNewsDetail\" data-theme=\"c\">" +
                "   <div id = \"commonHeader\"></div>" +
                "   <div id = \"newsDetail\" data-role=\"content\"></div>" +
                "   <div id = \"commonFooter\"></div>" +
                "</div>";

            this.setElement(html);

            this.id = options.id;

            this.renderHeader('ESF News', '#news');
            this.renderTheme();

            this.$el.bind("pagebeforeshow", _.bind(function() {
                this.render();
            }, this));
        },
        render: function() {
           // Clear content
            var $news = this.$("div[id=\"newsDetail\"]");
            $news.empty();

            // Success Handler function
            var displayNewsDetails = _.bind(function(data) {
                   $("#esfNewsDetail").find("[data-role=content]").html(data.viewer);
            }, this);
            // Error Handler function
            var errorHandler = _.bind(function(response) {
                this.coreErrorHandler(response);
            }, this);

            // Get the news details
            var JSONcommand = "http://www.esf.edu/mobile/mobileNewsView.asp?" + "newsID=" + this.id;
            result =  $.getJSON(JSONcommand)
            .done(displayNewsDetails)
            .fail(errorHandler);
        }
    });

    RouterManager.register({ routerClass: NewsRouter });

})(jQuery);