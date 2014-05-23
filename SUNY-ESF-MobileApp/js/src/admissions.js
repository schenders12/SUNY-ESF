// JavaScript Document
(function($) {
	    var AdmissionsRouter = BaseRouter.extend({
        routes: {
            "admissions": "showAdmissions",
        },
        showAdmissions: function() {
            this.loadPage("admissionsPage", AdmissionsPage);
            this.navigate("admissions", this.admissionsPage);
            $.mobile.silentScroll(0);
        },
    });

    var AdmissionsPage = BaseView.extend({
        events : {
            "click a" : "linkClick"
        },
        initialize: function() {
            var html =
                "<div data-role=\"page\" id=\"esfAdmissions\">" +
                " <div id = \"commonHeader\"></div>" +
                " <div data-role=\"content\">" + "</div>" +
                "   <ul data-role=\"listview\" data-inset=\"true\" class=\"esf_ListChoice\">" + 
                "      <li><a href=\"http://www.esf.edu/admissions\" data-target=\"_blank\"><h4>Admissions Home Page</h4></a></li>" +
                "      <li><a href=\"http://www.esf.edu/admissions/programs.htm\" data-target=\"_blank\"><h4>Undergraduate Degree Programs</h4></a></li>" +
                "      <li><a href=\"http://www.esf.edu/financialaid\" data-target=\"_blank\"><h4>Financial Aid</h4></a></li>" + 
                "      <li><a href=\"http://www.esf.edu/housing\" data-target=\"_blank\"><h4>Housing</h4></a></li>" +
                "    </ul>" + 
                " <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);

            this.renderHeader('Admissions', '#');
            this.renderTheme();
        }
    });

    RouterManager.register({routerClass: AdmissionsRouter });

})(jQuery);