// JavaScript Document
// All Events Model
var MainEventsModel = Backbone.Model.extend({
        defaults: {
          id:  'Main',
          title: 'Main Calendar',
          request:  '',
          requestedDate:  '',
          command:  '',
          data:  '',
          urlRoot: 'http://www.esf.edu/mobile/'
       },
       initialize:  function () {
       // TBD
       },
       fetch:  function () {
       // TBD
       },
});
var AlumniEventsModel = Backbone.Model.extend({
        defaults: {
          id:  'Alumni',
          title: 'Alumni/Parents/Friends',
          request:  'Alumni, Parents and Friends',
          requestedDate:  '',
          command:  '',
          data:  '',
       },
       initialize:  function () {
       // TBD
       },
       fetch:  function () {
       // TBD
       },
});
var FacultyEventsModel = Backbone.Model.extend({
        defaults: {
          id:  'Employees',
          title: 'Faculty/Staff',
          request:  'ESF Employees',
          requestedDate:  '',
          command:  '',
          data:  '',
       },
       initialize:  function () {
       // TBD
       },
       fetch:  function () {
       // TBD
       },
});
var StudentsEventsModel = Backbone.Model.extend({
        defaults: {
          id:  'Students',
          title: 'Students Calendar',
          request:  'Students',
          requestedDate:  '',
          command:  '',
          data:  '',
       },
       initialize:  function () {
       // TBD
       },
       fetch:  function () {
       // TBD
       },
});
var AthleticsEventsModel = Backbone.Model.extend({
        defaults: {
          id:  'Sports',
          title: 'Athletics Calendar',
          request:  'Sports',
          requestedDate:  '',
          command:  '',
          data:  '',
       },
       initialize:  function () {
       // TBD
       },
       fetch:  function () {
       // TBD
       },
});
