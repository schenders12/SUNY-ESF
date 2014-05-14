// JavaScript Document
// Push Notifications (Phone Gap Plugin)
// Initialized during the OnDeviceReady event
(function($) {
    pushESF = {
       esfAlreadyHere: "false",
       esfGAPermission: "false",
       esfPushNotification: null,
       pushStart: function() {
             console.log('Starting Push...');
             if (window.plugins) {
                console.log("Registering for Push....");
                var esfPushNotification = window.plugins.pushNotification;
                if (esfPushNotification) {
                   console.log('Registering for pushes');
                   if ( device.platform == 'android' || device.platform == 'Android' )
                   {
                      console.log('Registering for Android Platform push');
                      esfPushNotification.register(
                         successHandler,
                         errorHandler, {
                            "senderID": "61134333091",
                            "ecb":"onNotificationGCM"
                      });
                   }
                   else
                   {
                      console.log('Registering for IOS Platform push');
                      esfPushNotification.register(
                         tokenHandler,
                         errorHandler, {
                            "badge":"true",
                            "sound":"true",
                            "alert":"true",
                            "ecb":"onNotificationAPN"
                      });
                   }
                }
             }
             else {
                 console.log('No plugins found, could not register for Push.');
             }
       },
       onNotificationGCM: function(e) {
             console.log('Received Android Push');
             $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
 
             switch( e.event )
             {
             case 'registered':
             if ( e.regid.length > 0 )  {
                  $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                  console.log("regID = " + e.regid);
             }
             break;
 
             case 'message':
             if ( e.foreground )  {
                  $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
                  var my_media = new Media("/android_asset/www/"+e.soundname);
                  my_media.play();
             }
             else  { 
             if ( e.coldstart )  {
                $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
             }
             else  {
                $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
             }
             }
 
             $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
             $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
             break;
 
             case 'error':
             $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
             break;
 
             default:
             $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
             break;
             }
       },
       onNotificationAPN: function(e) {
             console.log('Received IOS Push');
       },
       exit: function() {
           // deactivate Google analytics
           //   alert("Deactivating push...");
           // ????
       }
};

})(jQuery);
