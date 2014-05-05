// JavaScript Document
(function($) {

    var ThemesRouter = BaseRouter.extend({
        routes: {
            "themes": "showThemes"
        },
        showThemes: function() {
            this.loadPage("themesPage", ThemesPage);
            this.navigate("themes", this.themesPage);
        }
    });

    var ThemesPage = BaseView.extend({
        events: {
            "change input[type=\"radio\"]": "themeSelect",
        },
        initialize: function() {
            var header = "";
            if (!this.router.nativeMode) {
                header +=
                    "  <div data-role=\"header\">" +
                    "    <a href=\"#\" data-icon=\"home\" data-iconpos=\"notext\" data-role=\"button\">Home</a>" +
                    "    <h1>Themes</h1>" +
                    "  </div>";
            }
            var html = 
                "<div id=\"themes\" data-role=\"page\" >" + header +
                "  <div id=\"content\" data-role=\"content\">" +
                "    <form>" +
                "      <fieldset data-role=\"controlgroup\"></fieldset>" +
                "    </form>" +
                "  </div>" +
                "</div>";
            this.setElement(html);
            var $controls = this.$("fieldset");
            var html = "<legend>Choose a theme:</legend>";
            _.each(ThemesUtil.getThemeDefs(), function(theme_def) {
                html += 
                    "<input type=\"radio\" id=\"" + theme_def.id + "\" name=\"" + theme_def.id + "\" value=\"" + theme_def.id + "\"/>" +
                    "<label for=\"" + theme_def.id + "\">" + theme_def.name + "</label>";
            });
            $controls.html(html);
            if (!ThemesUtil.hasValidTheme()) {
                this.$("div[data-role=\"header\"] a").hide();
            } else {
                var theme_def = ThemesUtil.getThemeDef();
                this.$("input[type=\"radio\"][value=\"" + theme_def.id + "\"]").attr({ "checked": true });
            }
            this.renderTheme();
        },
        themeSelect: function(e) {
            var theme_id = $(e.currentTarget).val();
            _.each(this.$("input[type=\"radio\"][value!=\"" + theme_id + "\"]"), function(input) {
                $(input).attr({ "checked": false }).checkboxradio("refresh");
            });
            ThemesUtil.setTheme(theme_id);
            this.$("div[data-role=\"header\"] a").show();
            e.preventDefault();
            window.location.reload();
        }
    });

    RouterManager.register({ routerClass: ThemesRouter });

})(jQuery);