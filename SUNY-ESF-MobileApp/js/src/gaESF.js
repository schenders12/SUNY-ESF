// JavaScript Document
// Google Analytics (Phone Gap Plugin)
// Initialized during the OnDeviceReady event
(function($) {
    var gaPlugin;

    gaESF = {
       esfAlreadyHere: "false",
       esfGAPermission: "false",
       gaStart: function() {
             console.log('Starting Google Analytics...');
             if (window.plugins) {
             alert("Registering for Phone Gap....");
                gaPlugin = window.plugins.gaPlugin;
             alert("Local storage...");
                this.esfAlreadyHere = window.localStorage.getItem('esfAlreadyHere');
                this.esfGAPermission = window.localStorage.getItem('esfGAPermission');
                if (!this.esfAlreadyHere) {
                   console.log('Confirm Analytics');
             alert('Confirm permission...');
                   this.gaConfirm();
                   //this.gaPermissionCallback();
                } else if (this.esfAlreadyHere && this.esfGAPermission == 'true') {
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
		   alert("GaInit...");
             gaPlugin.init(this.gaSuccessInitHandler, this.gaErrorInitHandler, "UA-5865890-4", 10);
             alert("Trackpage...");
             gaPlugin.trackPage( this.nativePluginResultHandler, this.nativePluginErrorHandler, "Index.html");
             alert("Done with init");
             console.log('Tracking Index.html!!!');
          alert('Tracking Index.html!!!');
       },
       gaTrackPage: function(pageID) {
       	alert("Tracking...");
                gaPlugin.trackPage( this.nativePluginResultHandler, this.nativePluginErrorHandler, pageID);
             console.log('Tracking ' + pageID +  '!!!');
          alert('Tracking ' + pageID +  '!!!');
       },
       gaConfirm: function () {
          // Confirming this is mandatory by Google
       alert('Navigator...');
          navigator.notification.confirm('We would like your permission to collect some anonymous usage data to help improve the ESF Mobile app.',this.gaPermissionCallback, 'Attention', 'Allow,Deny');

       },
       gaPermissionCallback: function () {
           alert("Permission...");
            // if (button === 1) {
                // Collect data and initialize 
                window.localStorage.setItem('esfAlreadyHere', 'true');
                window.localStorage.setItem('esfGAPermission', 'true');
                console.log('Successfully received permission for Google Analytics   :):) !!');
                alert("Calling gainit...");
                this.gaInit();
            // } else if (button === 2) {
                // Save choices to not ask again
               // window.localStorage.setItem('esfAlreadyHere', 'true');
                //window.localStorage.setItem('esfGAPermission', 'false')
                //console.log('Did not receive permission for Google Analytics   :(:( !!');
        //}
       },
       gaSuccessInitHandler: function () {
             console.log('Successfully initialized Google Analytics   :):) !!');
          alert('Successfully initialized Google Analytics   :):) !!');
       },
       gaErrorInitHandler: function () {
             console.log('Failed to initialize Google Analytics :(:(:( ');
          alert('Failed to initialize Google Analytics :(:(:( ');
       },
       nativePluginResultHandler: function () {
             console.log('Successfully tracking Index.html   :):) !!');
          alert('Successfully tracking Index.html   :):) !!');
       },
       nativePluginErrorHandler: function () {
             console.log('Failed to track Index.html:(:(:( ');
          alert('Failed to track Index.html:(:(:( ');
       },
       exit: function() {
           // deactivate Google analytics
        alert("Deactivating ga...");
           gaPlugin.exit(this.nativePluginResultHandler, this.nativePluginErrorHandler);
       }
};

})(jQuery);
