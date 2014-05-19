// JavaScript Document
// Push Notifications (Phone Gap Plugin)
// Initialized during the OnDeviceReady event
(function($) {
    var pushNotification;

    pushESF = {
       esfAlreadyHere: "false",
       esfGAPermission: "false",
       esfPushNotification: null,
       esfPushWooshId:  '7D3A0-4F65E',
       esfGCMId: '61134333091',
       esfAPN: '',
       platform: null,
       events : {
            "push-notification" : "pushReceived"
        },
       pushStart: function(myPlatform) {
             console.log('Starting Push...');
             if (window.plugins) {
                console.log("Registering for Push....");
                pushNotification = window.plugins.pushNotification;
                if (pushNotification) {
                   console.log('Registering for pushes');
                   this.platform = myPlatform;
                   if ( myPlatform == 'android' || myPlatform == 'Android' )
                   {
                      console.log('Registering for Android Platform push');
                     // pushNotification.register(this.pushAndroidSuccessHandler, this.pushAndroidErrorHandler,{"senderID":"this.esfGCMId","ecb":"this.onNotificationGCM"});
                      pushNotification.registerDevice({ alert:true, badge:true, sound:true,  projectid: this.esfGCMId, appid : this.esfPushWooshId },
                                    function(status) {
                                        var pushToken = status;
                                        console.log('Android push token: ' + JSON.stringify(pushToken));
                                    },
                                    function(status) {
                                        console.log(JSON.stringify(['failed to register', status]));
                                    });
                   }
                   else
                   {
                      console.log('Registering for IOS Platform push');
//pushNotification.register(this.pushIOSSuccessHandler,this.pushIOSErrorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"this.onNotificationAPN"});
                      pushNotification.registerDevice({ alert:true, badge:true, sound:true, pw_appid : this.esfPushWooshId },
                                    function(e) {
                                        var pushToken = e['deviceToken'];
                                        //console.log('IOS push token: ' + JSON.stringify(pushToken));
                                        console.log('IOS push token: ' + pushToken);
                                    },
                                    function(status) {
                                        console.log(JSON.stringify(['failed to register', status]));
                                    });
                   }
                }
             }
             else {
                 console.log('No plugins found, could not register for Push.');
				 alert("No plugins found...");
             }
       },
      pushReceived: function(e) {
            alert('Push Received! Platform = '+ this.platform);
            if ( myPlatform == 'android' || myPlatform == 'Android' )  {
            }
            else {
               onNotificationAPN(e);
            }
       },
       pushAndroidSuccessHandler: function(result) {
            alert('Android registrationCallback Success! Result = '+result);
       },
       pushAndroidErrorHandler: function(error) {
            alert(error);
       },
       pushIOSSuccessHandler: function(result) {
            console.log('IOS registrationCallback Success! Result = '+result);
       },
       pushIOSErrorHandler: function(error) {
            console.log(error);
       },
       onNotificationGCM: function(e) {
             console.log('Received Android Push');
            // $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
 
             switch( e.event )
             {
             case 'registered':
             if ( e.regid.length > 0 )  {
                 // $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                  console.log("regID = " + e.regid);
             }
             break;
 
             case 'message':
             if ( e.foreground )  {
                 // $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
                  var my_media = new Media("/android_asset/www/"+e.soundname);
                  my_media.play();
                  alert('message = '+e.message+' msgcnt = '+e.msgcnt);
             }
             else  { 
                 if ( e.coldstart )  {
                //$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                 }
                 else  {
                //$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                 }
             }
 
             //$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            // $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
             break;
 
             case 'error':
             //$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
             break;
 
             default:
             //$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
             break;
             }
       },
       onNotificationAPN: function(e) {
             var notification = e.notification;
             alert(notification.aps.alert);
             pushNotification.setApplicationIconBadgeNumber(0);
             console.log('Received IOS Push');
             alert('Received IOS Push!!');
             if (e.alert) {
                navigator.notification.alert(e.alert);
             }
             if (e.badge) {
                pushNotification.setApplicationIconBadgeNumber(this.pushIOSSuccessHandler, this.pushIOSErrorHandler, e.badge);
             }
             if (e.sound) {
                var snd = new Media(e.sound);
                snd.play();
             }
       },
       exit: function() {
           //   alert("Deactivating push...");
           pushNotification.unregisterDevice(pushSuccessHandler, pushErrorHandler);
       }
};

})(jQuery);
