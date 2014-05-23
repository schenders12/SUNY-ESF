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
		   alert("Initialize..." + this.id + " " + this.entry_url + "" + this.name);
		   
       // TBD
       },
       fetch:  function () {
       // TBD
		   alert("Fetch...");
       },
});

var AppDefModelCollection = Backbone.Collection.extend({
         model:  AppDefModel,
         url: 'mobile/app_def.json',
        initialize:   function(){
          // this.add(new AppDefModel());
		  // AppDefModel.fetch();
        },
    });

