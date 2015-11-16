'use strict';

/**
 * @ngdoc overview
 * @name tinkApp
 * @description
 * # tinkApp
 *
 * Main module of the application.
 */
 angular
 .module('tinkApp', [
   'ngAnimate',
   'ngCookies',
   'ngResource',
   'ngRoute',
   'tink.fieldset',
   'tink.datepicker',
   'tink.identitycardnumber',
   'tink.safeApply',
   'tink.timepicker',
   'tink.rangedatepicker',
   'tink.nationalnumber'
   ])
 .config(function ($routeProvider) { /*, $locationProvider */
  $routeProvider
  .when('/', {
    templateUrl: 'views/home.html',
    controller: 'MainCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });

  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });
  // $locationProvider.hashPrefix('!');
}).controller('controllero',function($scope){
    this.field1 = '';
    this.field2 = 'Christelijke Mutualiteit';
    this.field3 = '';
    this.field4 = '';
    this.field5 = '';
    this.field1 = 'only to see';
    this.field6 = '';
    this.dataShow = function(){
      console.log(this.field1)
      console.log(this.field2)
      console.log(this.field3)
      console.log(this.field4)
      console.log(this.field5)
      console.log(this.field6)
    }
  });
