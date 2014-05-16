// JavaScript Document
// Google Analytics (Phone Gap Plugin)
// Initialized during the OnDeviceReady event
(function($) {
    var gaPlugin;

    gaESF = {
       esfAlreadyHere: "false",
       esfGAPermission: "false",
       esfGAId: "UA-5865890-4",
       gaStart: function() {
             console.log('Starting Google Analytics...');
             if (window.plugins) {
                gaPlugin = window.plugins.gaPlugin;
                this.esfAlreadyHere = window.localStorage.getItem('esfAlreadyHere');
                this.esfGAPermission = window.localStorage.getItem('esfGAPermission');
                if (!this.esfAlreadyHere) {
                   console.log('Confirming Analytics...');
                   this.gaConfirm();
                } else if (this.esfAlreadyHere && this.esfGAPermission == 'true') {
                   console.log('Permission granted already (thanks!). Starting GA...');
                   this.gaInit();
                } else {
                   console.log('We are not allowed to collect data');
                }
             }
             else {
                 console.log('No plugins found, could not start Google Analytics.');
             }
       },
       gaInit: function() {
             //gaPlugin.init(this.gaSuccessInitHandler, this.gaErrorInitHandler, "UA-5865890-4", 10);
             gaPlugin.init(this.gaSuccessInitHandler, this.gaErrorInitHandler, this.esfGAId, 10);
             gaPlugin.trackPage( this.nativePluginResultHandler, this.nativePluginErrorHandler, "Index.html");
             console.log('GA is successfully Tracking the ESF Mobile App!!!');
       },
       gaTrackPage: function(pageID) {
             gaPlugin.trackPage( this.nativePluginResultHandler, this.nativePluginErrorHandler, pageID);
             console.log('GA is Tracking ' + pageID +  '!!!');
       },
       gaConfirm: function () {
          // Confirming this is mandatory by Google
          navigator.notification.confirm('The ESF Communications office would like your permission to collect some anonymous usage data to help improve the ESF Mobile app.',this.gaPermissionCallback, 'Attention', 'Allow,Deny');

       },
       gaPermissionCallback: function () {
             if (button === 1) {
                // Collect data and initialize 
                window.localStorage.setItem('esfAlreadyHere', 'true');
                window.localStorage.setItem('esfGAPermission', 'true');
                console.log('Successfully received permission for Google Analytics   :):) !!');
                console.log("Calling GA init...");

                //this.gaInit(); // for some reason call to gaInit() does not work so had to cut& paste code
                //gaPlugin.init(this.gaSuccessInitHandler, this.gaErrorInitHandler, "UA-5865890-4", 10);
                gaPlugin.init(this.gaSuccessInitHandler, this.gaErrorInitHandler, this.esfGAId, 10);
                gaPlugin.trackPage( this.nativePluginResultHandler, this.nativePluginErrorHandler, "Index.html");
                console.log('GA is successfully Tracking the ESF Mobile App!!!');
                // end cut&paste of gaInit()(

             } else if (button === 2) {
                // Save choices. do not ask again
                window.localStorage.setItem('esfAlreadyHere', 'true');
                window.localStorage.setItem('esfGAPermission', 'false')
                console.log('Did not receive permission for Google Analytics and will not ask again   :(:( !!');
             }
       },
       gaSuccessInitHandler: function () {
             console.log('Successfully initialized Google Analytics   :):) !!');
       },
       gaErrorInitHandler: function () {
             console.log('Failed to initialize Google Analytics :(:(:( ');
       },
       nativePluginResultHandler: function () {
             console.log('Successfully tracking new page with GA   :):) !!');
       },
       nativePluginErrorHandler: function () {
             console.log('Failed to track GA Page view:(:(:( ');
       },
       exit: function() {
             // deactivate Google analytics
             console.log('Deactivating GA, good-bye until next time');
             gaPlugin.exit(this.nativePluginResultHandler, this.nativePluginErrorHandler);
       }
};

})(jQuery);
