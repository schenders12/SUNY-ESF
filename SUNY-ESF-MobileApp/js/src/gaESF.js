// JavaScript Document
// Google Analytics (Phone Gap Plugin)
// Initialized during the OnDeviceReady event
(function($) {
    gaESF = {
       esfAlreadyHere: "false",
       esfGAPermission: "false",
       esfGAPlugin: null,
       gaStart: function() {
             console.log('Starting Google Analytics...');
             alert('Starting Google Analytics...');
             if (window.plugins) {
                alert("Registering for Phone Gap....");
                this.esfGAPlugin = window.plugins.gaPlugin;
                this.esfAlreadyHere = window.localStorage.getItem('esfAlreadyHere');
                this.esfGAPermission = window.localStorage.getItem('esfGAPermission');
                if (!esfAlreadyHere) {
                   console.log('Confirm Analytics');
             alert('Confirm...');
                   this.gaConfirm();
                } else if (esfAlreadyHere && esfGAPermission == 'true') {
                   this.gaInit();
                } else {
                   console.log('We are not allowed to collect data');
                }
             }
             else {
                 console.log('No plugins found, could not start Google Analytics.');
                 alert("No GA");
             }
       },
       gaInit: function() {
             this.esfGAPlugin.init(gaSuccessInitHandler, gaErrorInitHandler, "UA-5865890-4", 10);
             this.esfGAPlugin.trackPage( nativePluginResultHandler, nativePluginErrorHandler, "Index.html");
             console.log('Tracking Index.html!!!');
       },
       gaTrackPage: function(pageID) {
             if (this.esfGAPlugin) { 
                this.esfGAPlugin.trackPage( nativePluginResultHandler, nativePluginErrorHandler, pageID);
             }
             console.log('Tracking ' + pageID +  '!!!');
       },
       gaConfirm: function () {
          // Confirming this is mandatory by Google
             alert('Navigator...');
          navigator.notification.confirm('We would like your permission to collect some anonymous usage data to help improve the ESF Mobile app.',gaPermissionCallback, 'Attention', 'Allow,Deny');
       },
       gaPermissionCallback: function () {
             if (button === 1) {
                // Collect data and initialize 
                window.localStorage.setItem('esfAlreadyHere', 'true');
                window.localStorage.setItem('esfGAPermission', 'true');
                console.log('Successfully received permission for Google Analytics   :):) !!');
                this.gaInit();
             } else if (button === 2) {
                // Save choices to not ask again
                window.localStorage.setItem('esfAlreadyHere', 'true');
                window.localStorage.setItem('esfGAPermission', 'false')
                console.log('Did not receive permission for Google Analytics   :(:( !!');
        }
       },
       gaSuccessInitHandler: function () {
             console.log('Successfully initialized Google Analytics   :):) !!');
       },
       gaErrorInitHandler: function () {
             console.log('Failed to initialize Google Analytics :(:(:( ');
       },
       nativePluginResultHandler: function () {
             console.log('Successfully tracking Index.html   :):) !!');
       },
       nativePluginErrorHandler: function () {
             console.log('Failed to track Index.html:(:(:( ');
       },
       exit: function() {
           // deactivate Google analytics
           //   alert("Deactivating ga...");
           this.esfGAPlugin.exit(nativePluginResultHandler, nativePluginErrorHandler);
       }
};

})(jQuery);
