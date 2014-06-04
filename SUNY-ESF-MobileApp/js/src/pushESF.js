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
       myPlatform: null,
       myDeviceToken: null,
       events : {
            "push-notification" : "pushReceived"
       },
       pushStart: function(myPlatform) {
             console.log('Starting Push...');
             // this.mySubscription = window.localStorage.getItem('mySubscription');
             window.localStorage.setItem('mySubscription', 'true');
             if (window.plugins) {
                console.log("Registering for Push....");
                //if (this.mySubscription) {
                   pushNotification = window.plugins.pushNotification;
                   console.log('Registering for Android pushes');
                   this.myPlatform = myPlatform;
                   if ( myPlatform == 'android' || myPlatform == 'Android' )
                   {
                      console.log('Registering for Android Platform push');
                     // pushNotification.register(this.pushAndroidSuccessHandler, this.pushAndroidErrorHandler,{"senderID":"this.esfGCMId","ecb":"this.onNotificationGCM"});
                      pushNotification.registerDevice({ alert:true, badge:true, sound:true,  projectid: this.esfGCMId, appid : this.esfPushWooshId },
                                    function(status) {
                                        var pushToken = status;
                                        this.myDeviceToken = JSON.stringify(pushToken);
                                        console.log('Android push token: ' + this.myDeviceToken);
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
                                    function(status) {
                                        var pushToken = status;
                                        this.myDeviceToken = JSON.stringify(pushToken);
                                        console.log('IOS push token: ' + this.myDeviceToken);
                                    },
                                    function(status) {
                                        console.log(JSON.stringify(['failed to register', status]));
                                    });
                   }
                   pushNotification.onDeviceReady();
               // }
             }
             else {
                 console.log('No plugins found, could not register for Push.');
                 alert("No plugins found...");
             }
       },
       pushReceived: function(e) {
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
            // alert(notification.aps.alert);
             pushNotification.setApplicationIconBadgeNumber(0);
             console.log('Received IOS Push');
             navigator.notification.alert(JSON.stringify(e.notification));
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
       confirmPushStop: function() {
                 navigator.notification.confirm('You will no longer receive Push Notifications from the ESF Mobile app.',this.pushStop, 'Unsubscribe', 'Confirm,Cancel');
       },
       confirmPushStart: function() {
                 navigator.notification.confirm('Please confirm that you wish to receive SUNY-ESF Push Notifications.',function (button) {
                             if (button === 1) {
                                console.log('Subscribing to ESF Push notifications');
                                 this.pushStart();
                               } else if (button === 2) {
                                    // do nothing
                               }
                     }, 'Subscribe', 'Confirm,Cancel');
       },
       pushStop: function(button) {
             if (button === 1) {
                  window.localStorage.setItem('mySubscription', 'false');
                  console.log('Unsubscribing from ESF Push, sayonara!!!');
                  pushNotification.unregisterDevice(this.esfPushWooshId, this.myDeviceToken);

             } else if (button === 2) {
                // do nothing
             }
       }
};

})(jQuery);
