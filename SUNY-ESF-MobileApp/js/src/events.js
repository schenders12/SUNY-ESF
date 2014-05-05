// JavaScript Document
(function($) {

   function DateAdd(date, type, amount){
          var y = date.getFullYear(),
           m = date.getMonth(),
          d = date.getDate();
          if(type === 'y'){
             y += amount;
          };
          if(type === 'm'){
             m += amount;
          };
          if(type === 'd'){
              d += amount;
          };
          return new Date(y, m, d);
        }

   function DateTranslate(date){
            var dd = date.getDate();
            var mm = date.getMonth()+1; //January is 0!
            var yyyy = date.getFullYear();

            if(dd<10) {
                dd='0'+dd
            }
            if(mm<10) {
                mm='0'+mm
            } 
            var reqDate = mm+'/'+dd+'/'+yyyy;
            return reqDate;
        }

    var EventsCollection = Backbone.Collection.extend({
       initialize:   function(){
           this.add(new MainEventsModel());
           this.add(new AlumniEventsModel());
           this.add(new FacultyEventsModel());
           this.add(new StudentsEventsModel());
           this.add(new AthleticsEventsModel());
        },
    });

    var EventsRouter = BaseRouter.extend({
        routes: {
            "events": "showEventChoice",
            "events/upcoming/:calendar": "showUpcoming",
            "events/detail/:eventID": "showEventsDetail",
            "events/yesterday": "showYesterdaysEvents",
            "events/tomorrow": "showTomorrowsEvents",
        },
        initialize: function() {
          if (!this.EventsModels) {
              this.EventsModels = new EventsCollection();
          }
        },
        updateDates: function(options) {
            requestedDate = DateTranslate(options.date);

            // Set yesterday and tomorrow's date
            yesterday = DateAdd(options.date, 'd', -1);
            yesterdaysDate = DateTranslate(yesterday);
            tomorrow = DateAdd(options.date, 'd', 1);
            tomorrowsDate = DateTranslate(tomorrow);

            // Save data
            this.eventsUpcomingPage.requestedDate = requestedDate;
            this.eventsUpcomingPage.todaysDate = options.date;
            this.eventsUpcomingPage.yesterdaysDate = yesterdaysDate;
            this.eventsUpcomingPage.yesterday = yesterday;
            this.eventsUpcomingPage.tomorrowsDate = tomorrowsDate;
            this.eventsUpcomingPage.tomorrow = tomorrow;
        },
        showEventChoice: function() {
            this.loadPage("eventsChoicePage", EventChoicePage, {collection: this.eventsList});
            this.navigate("events", this.eventsChoicePage);
            $.mobile.silentScroll(0);
        },
        showUpcoming: function (calendar) {
            this.calendar = calendar;
            this.loadPage("eventsUpcomingPage", EventsUpcomingPage, {calendar: this.calendar});

            // Set initial event request date to today
            var today = new Date();	
            this.updateDates({date:today});

            // Save the calendar
            this.eventsUpcomingPage.calendar = this.calendar;
            this.eventsUpcomingPage.todayStatic = today;

            this.eventsUpcomingPage.render();
            // Create the route path and navigate
            var path = "events/list/" + calendar;
            this.navigate(path, this.eventsUpcomingPage);
            $.mobile.silentScroll(0);
        },
        showYesterdaysEvents: function() {
            this.loadPage("eventsListPage", EventsPage, {calendar: this.calendar});

            // Set event request date to yesterday
            var today = this.eventsListPage.todaysDate;
            today = DateAdd(today, 'd', -1);
            this.updateDates({date:today});

            this.eventsListPage.render();

            // Create the route path and navigate
            var path = "events/list/" + this.calendar;
            this.navigate(path, this.eventsListPage);
            $.mobile.silentScroll(0);
        },
        showTomorrowsEvents: function() {
            this.loadPage("eventsListPage", EventsPage, {calendar: this.calendar});

            // Set event request date to tomorrow
            var today = this.eventsListPage.todaysDate;
            today = DateAdd(today, 'd', 1);
            this.updateDates({date:today});

            this.eventsListPage.render();

            // Create the route path and navigate
            var path = "events/list/" + this.calendar;
            this.navigate(path, this.eventsListPage);
            $.mobile.silentScroll(0);
        },
        showEventsDetail: function (eventID) {
            this.loadPage("eventsDetailPage", EventsDetailPage, {id: eventID, calendar: this.calendar});

            // Update the event ID
            this.eventsDetailPage.id = eventID;
            this.navigate("events/detail", this.eventsDetailPage);
            $.mobile.silentScroll(0);
        }
    });

   EventsUpcomingPage = BaseView.extend({
       initialize: function (options) {
            this.calendar = options.calendar;
            var todayRoute = '#events/list/' + this.calendar;
            var html =
                "<div data-role=\"page\" id=\"esfEventList\">" +
                "   <div id = \"commonHeader\"></div>" +
                "   <div data-role=\"content\"></div>" + 
                "   <div id = \"commonFooter\"></div>" +
                "</div>";

            this.setElement(html);

            this.renderHeader('Calendars', '#events');
            this.renderTheme();;
        },
       render: function () {
            // Clear the content
            var $content = this.$("div[data-role=\"content\"]");
            $content.empty();

            // Get the Events model
            this.eventModel = this.router.EventsModels.get(this.calendar);

            var data;
            // Get the event data
            var command = "http://www.esf.edu/mobile/mobileEvents.asp?requestedDate=" + this.requestedDate + "&Cal=" + this.eventModel.get('request') + "&oneDay=true";

            var loadevents = $.getJSON(command).done(_.bind(function(data) {
               var eventStartDate = "none";
               var counter = 0;
               var currentHTML = $content.html();
               var currentlistViewName;
               // Loop over each date
               _.each(data.Events, function(events, index) {
                     counter = counter + 1;
                     currentlistViewName = "#esfEvents" + counter;
                     // Create an HTML string for the date and add to current html
                     // Create a listview for each event
                     currentHTML += "<p  class=\"ev_ListDate\">" + events.eventDate + "</p>" + 
                                    "<ul data-role=\"listview\" id=" + currentlistViewName + " class=\"ev_ListView\">";
                     // Loop over each event
                     _.each(events.Event, function(myEvents, index2) {
                         // Create a listview item for each event and add to listview
                        var eventLocInfo;
                        if (myEvents.eventOngoing)  {
                            eventLocInfo = "<span class=\"redgray\"><em><strong>" + myEvents.eventLocation + "</strong></em></span>";
                        }
                        else  {
                            eventLocInfo = myEvents.eventLocation;
                        }
                        var eventDateInfo;
                        if (myEvents.eventStartDate)  {
                            if (myEvents.eventDateTime) {
                               eventDateInfo = myEvents.eventStartDate + " | ";
                            }
                            else {
                               eventDateInfo = myEvents.eventStartDate;
                            }
                        }
                        else  {
                            eventDateInfo = "";
                        }
                        // Create a new list item for each event
                        var eventInfo = "<li class=\"ev_ListItem\">" +
                                  "<a href=\"#events/detail/" + myEvents.eventID + "\">" +
                                  "<h3  class=\"darkblue\">" + myEvents.eventNameString + "</h3>" + 
                                  "<p>" +  eventDateInfo + myEvents.eventDateTime + eventLocInfo + "</p></a></li>";
                        currentHTML += eventInfo;
                     }, this); // each event
                     currentHTML += "</ul>";
                }, this);  // each date

                $content.html(currentHTML);
            }, this))
            // Error Handler function
            .fail(_.bind(function(response) {
                this.coreErrorHandler(response);
            }, this));

            // Set the page title to the calendar name
            var $title = this.$("#esfPageTitle");
            $title.html(this.eventModel.get('title'));

            } // render function
    });

    var EventsDetailPage = BaseView.extend({
        events : {
            "click a" : "linkClick"
        },
        initialize: function (options) {
            var html =
                "<div data-role=\"page\" id=\"esfEventsDetail\">" +
                "   <div id = \"commonHeader\"></div>" +
                "   <div data-role=\"content\"></div>" +
                "   <div id = \"eventsDetail\" data-role=\"content\"></div>" +
                "   <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);

            this.id = options.id;
            this.calendar = options.calendar;
            var backpath = "#events/upcoming/" + this.calendar;
            this.renderHeader('ESF Event Detail', backpath);
            this.renderTheme();


            this.$el.bind("pagebeforeshow", _.bind(function () {
                this.render();
            }, this));
        },
        render: function () {
           // Clear content
            var $events = this.$("div[id=\"eventsDetail\"]");
            $events.empty();

            // Success Handler function
            var displayEventDetails = _.bind(function(data) {
                $events.html(data.viewer);
            }, this);
            // Error Handler function
            var errorHandler = _.bind(function(response) {
                this.coreErrorHandler(response);
            }, this);

            // Get the event details
            var JSONcommand = "http://www.esf.edu/mobile/mobileEvent.asp?" + "eventID=" + this.id;
            result =  $.getJSON(JSONcommand)
            .done(displayEventDetails)
            .fail(errorHandler);
        }

    });

    var EventChoicePage = BaseView.extend({
       initialize: function(options) {
            var html =
                "<div data-role=\"page\" id=\"esfEventChoice\">" + 
                " <div id = \"commonHeader\"></div>" +
                " <div data-role=\"content\">" +
                // Create calendar choice listview 
                "    <ul data-role=\"listview\" id=\"eventChoice\" data-inset=\"true\" class=\"esf_ListChoice\">" +
                "      <li id=\"esfMainCalendar\"><a href=\"#events/upcoming/Main\"><h4>Main</h4></a></li>" +
                "      <li id=\"esfAlumniCalendar\"><a href=\"#events/upcoming/Alumni\"><h4>Alumni/Parents/Friends</h4></a></li>" +
                "      <li id=\"esfFacStaffCalendar\"><a href=\"#events/upcoming/Employees\"><h4>Faculty/Staff</h4></a></li>" +
                "      <li id=\"esfStudentsCalendar\"><a href=\"#events/upcoming/Students\"><h4>Students</h4></a></li>" +
                "      <li id=\"esfAthleticsCalendar\"><a href=\"#events/upcoming/Sports\"><h4>Athletics</h4></a></li>" +
                "    </ul>" +
                "  </div>" +
                "  <div id = \"commonFooter\"></div>" +
                "</div>";
            this.setElement(html);

            this.renderHeader('ESF Events', '#');
            this.renderTheme();

       }
    });

    RouterManager.register({ routerClass: EventsRouter });

})(jQuery);