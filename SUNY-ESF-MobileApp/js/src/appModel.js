// JavaScript Document
// All Events Model
var AppDefModel = Backbone.Model.extend({
        defaults: {
          id:  '',
		  secure: '',
          name: '',
		  updated: '',
          icon_low:  '',
          icon_high:  '',
          entry_url:  '',
       },
       initialize:  function () {
           //  alert(JSON.stringify(this));
       // TBD
       },
       fetch:  function () {
       // TBD
		  // alert("Fetch...");
       },
});

var AppDefModelCollection = Backbone.Collection.extend({
         model:  AppDefModel,
         url: 'mobile/app_def.json',
         initialize:   function(app_def){
        },
    });

