// JavaScript Document
(function($) {
    // Router for About page
    var AboutRouter = BaseRouter.extend({
        routes: {
            "about": "showIndex",
            "about/about": "showMobileInfo",
            "about/facts": "showFacts",
            "about/history": "showHistory",
            "about/rankings": "showRankings",
            "about/welcome" : "showWelcome",
            "about/push" : "showPush"
        },
        showIndex: function() {
            this.loadPage("indexPage", IndexPage);
            this.navigate("about", this.indexPage);
            $.mobile.silentScroll(0);
        },
        showMobileInfo: function() {
            this.loadPage("aboutPage", AboutPage);
            this.navigate("about/about", this.aboutPage);
            $.mobile.silentScroll(0);
        },
        showFacts: function() {
            this.loadPage("factsPage", FactsPage);
            this.navigate("about/facts", this.factsPage);
            $.mobile.silentScroll(0);
        },
        showHistory: function() {
            this.loadPage("historyPage", HistoryPage);
            this.navigate("about/history", this.historyPage);
            $.mobile.silentScroll(0);
        },
        showWelcome: function() {
            this.loadPage("welcomePage", WelcomePage);
            this.navigate("about/welcome", this.welcomePage);
            $.mobile.silentScroll(0);
        },		
        showRankings: function() {
            this.loadPage("rankingsPage", RankingsPage);
            this.navigate("about/rankings", this.rankingsPage);
            $.mobile.silentScroll(0);
        },
        showPush: function() {
            this.loadPage("pushPage", PushPage);
            this.navigate("about/push", this.pushPage);
            $.mobile.silentScroll(0);
        },
    });

    var IndexPage = BaseView.extend({
        initialize: function() {
			var html =
				"<div data-role=\"page\" id=\"esfAbout\">" +
				" <div id = \"commonHeader\"></div>" + 
				"  <div data-role=\"content\">" + 
				"   <ul data-role=\"listview\" data-inset=\"true\" class=\"esf_ListChoice\">" + 
				"      <li><a href=\"#about/welcome\"><h4>Welcome to ESF</h4></a></li>" +
				"      <li><a href=\"#about/history\"><h4>ESF History</h4></a></li>" +
				"      <li><a href=\"#about/facts\"><h4>ESF Facts</h4></a></li>" + 
				"      <li><a href=\"#about/rankings\"><h4>Rankings and Ratings</h4></a></li>" +
				"      <li><a href=\"#about/push\"><h4>ESF Push Notifications</h4></a></li>" + 
				"      <li><a href=\"#about/about\"><h4>About ESF Mobile</h4></a></li>" + 
				"    </ul>" + 
				"  </div>" +  
				"  <div id = \"commonFooter\"></div>" +
				"</div>";

            this.setElement(html);

            this.renderHeader('About ESF', '#');
            this.renderTheme();
        }
    });

    var AboutPage = BaseView.extend({
        events: {
            "click #mail": "linkClick",
        },
        initialize: function() {
            var html =
                "<div data-role=\"page\" id=\"esfAboutMobile\">" +
                " <div id = \"commonHeader\"></div>" + 
                "  <div data-role=\"content\">" +
                "    <p class=\"help\">The ESF Mobile App was developed internally by the ESF Communications Department.</p>" +
                "    <p class=\"help\">Please contact" + 
                "    <a href=\"mailto:mobile@esf.edu\" id=\"mail\">mobile@esf.edu</a> with any questions or comments.</p>" +
                "  </div>" +
                "  <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);

            this.renderHeader('ESF Mobile Info', '#about');
            this.renderTheme();
        },
        pushUnsubscribe: function(e) {
                e.preventDefault();
                if (pushESF.mySubscription) {
                   pushESF.confirmPushStop();
                }
        },
        pushSubscribe: function(e) {
                e.preventDefault();
                window.localStorage.setItem('mySubscription', 'true');
                pushESF.mySubscription = true;
                pushESF.pushStart();
        }
    });

    var WelcomePage = BaseView.extend({
        events: {
            "click a": "linkClick"
        },
        initialize: function() {
            var html =
                "<div data-role=\"page\" id=\"esfWelcome\">" +
                " <div id = \"commonHeader\"></div>" +
                " <div data-role=\"content\"></div>" +
                "  <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);

            $.get("http://www.esf.edu/mobile/includes/message.html").done(_.bind(function(data) {
                  $("#esfWelcome").find("[data-role=content]").html(data);
            }, this))
            // Error Handler function
            .fail(_.bind(function(response) {
                this.coreErrorHandler(response);
            }, this));

            this.renderHeader('Welcome to ESF', '#about');
            this.renderTheme();
        }
    });

    var HistoryPage = BaseView.extend({
        events: {
            "click a": "linkClick"
        },
        initialize: function() {
            var html =
                "<div data-role=\"page\" id=\"esfHistory\">" +
                " <div id = \"commonHeader\"></div>" + 
                " <div data-role=\"content\"></div>" +
                "  <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);

            $.get("http://www.esf.edu/mobile/includes/history.html").done(_.bind(function(data) {
                  $("#esfHistory").find("[data-role=content]").html(data);
            }, this))
            // Error Handler function
            .fail(_.bind(function(response) {
                this.coreErrorHandler(response);
            }, this));

            this.renderHeader('ESF History', '#about');
            this.renderTheme();
        }
    });

    var FactsPage = BaseView.extend({
        events: {
            "click a": "linkClick"
        },
        initialize: function() {
            var html =
                "<div data-role=\"page\" id=\"esfFacts\">" +
                " <div id = \"commonHeader\"></div>" +
                " <div data-role=\"content\"></div>" +
                "  <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);

            $.get("http://www.esf.edu/mobile/includes/facts.html").done(_.bind(function(data) {
                   $("#esfFacts").find("[data-role=content]").html(data);
            }, this))
            // Error Handler function
            .fail(_.bind(function(response) {
                this.coreErrorHandler(response);
            }, this));

            this.renderHeader('About the College', '#about');
            this.renderTheme();
        }
    });

    var RankingsPage = BaseView.extend({
        events: {
            "click a": "linkClick"
        },
        initialize: function() {
            var html =
                "<div data-role=\"page\" id=\"esfRankings\">" +
                " <div id = \"commonHeader\"></div>" +
                " <div data-role=\"content\"></div>" +
                "  <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);

            $.get("http://www.esf.edu/mobile/includes/rankings.html").done(_.bind(function(data) {
                  $("#esfRankings").find("[data-role=content]").html(data);
            }, this))
            // Error Handler function
            .fail(_.bind(function(response) {
                this.coreErrorHandler(response);
            }, this));

            this.renderHeader('ESF Rankings', '#about');
            this.renderTheme();
        }
    });

    var PushPage = BaseView.extend({
        events: {
            "click #pushUnsubscribe" : "pushUnsubscribe",
            "click #pushSubscribe" : "pushSubscribe",
        },
        initialize: function() {
            var html =
                "<div data-role=\"page\" id=\"esfPush\">" +
                " <div id = \"commonHeader\"></div>" + 
                "  <div data-role=\"content\">" +
                "    <p>To subscribe to ESF Push Notifications, please click " + 
                "    <a href=\"\" id=\"pushSubscribe\">here</a>.</p>" +
                "    <p>To unsubscribe from ESF Push Notifications, please click " + 
                "    <a href=\"\" id=\"pushUnsubscribe\">here</a>.</p>" +
                "  </div>" +
                "  <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);

            this.renderHeader('ESF Push Notifications', '#about');
            this.renderTheme();
        },
        pushUnsubscribe: function(e) {
                e.preventDefault();
                pushESF.confirmPushStop();
        },
        pushSubscribe: function(e) {
                e.preventDefault();
                pushESF.mySubscription = 'true';
                window.localStorage.setItem('mySubscription', 'true');
                pushESF.pushStart();
        }
    });

    RouterManager.register({ routerClass: AboutRouter });

})(jQuery);
