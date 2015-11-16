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
;'use strict';

/**
 * @ngdoc function
 * @name tinkApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tinkApp
 */
 angular.module('tinkApp')
 .controller('MainCtrl', function ($scope) {


});

;'use strict';
(function(module) {
  try {
    module = angular.module('tink.fieldset');
  } catch (e) {
    module = angular.module('tink.fieldset', []);
  }
  module.directive('tinkFieldset', ['safeApply','$timeout',function (safeApply,$timeout) {
    return {
      restrict: 'A',
      priority:0,
      scope: {
        valuesChanged: '='
      },
      require:'form',
      link: function(scope,element,attr) {

   
        var initSerialize;
        var focus = 0;

        var elementWithMouseOver = [];
        var classToSetWhenOnHover = "mouseOver";
        var classToSetWhenDefault = "mouseOff";
        var classToSetWhenActive = "mouseFocus";

        setClassActive(classToSetWhenDefault);

        var activeClass = '';
        function setClassActive(cssClass){
          
          if(cssClass !== activeClass){
            $(element).removeClass(activeClass);
            $(element).addClass(cssClass);
            activeClass = cssClass;
          }
        }

        function mouseOverEvent(e,elem){
          safeApply(scope,function(){
            if(activeClass !== classToSetWhenActive){
              setClassActive(classToSetWhenOnHover);
            }
          })
        }

        function mouseOutEvent(e,elem){
          safeApply(scope,function(){
            if(activeClass !== classToSetWhenActive){
              setClassActive(classToSetWhenDefault);
            }
          })          
        }

        function blurEvent(e,elem){
          safeApply(scope,function(){
            $timeout(function(){
              if(initSerialize !== getSerializeObject()){
                scope.valuesChanged = true;
              }else{
                scope.valuesChanged = false;
              }
              focus = 0;
              setClassActive(classToSetWhenDefault);
            },0);
          })  
        }

        function focusEvent(){
          safeApply(scope,function(){
            $timeout(function(){
              focus = 1;
              setClassActive(classToSetWhenActive);
            },0);
          });
        }

        function getSerializeObject(){
          var serialize = {};
          for (var i = elementWithMouseOver.length - 1; i >= 0; i--) {
            var ngModel = $(elementWithMouseOver[i]).attr('ng-model') || $(elementWithMouseOver[i]).attr('data-ng-model');
            var value;
            if($(elementWithMouseOver[i]).scope().$eval(ngModel)){
              value = $(elementWithMouseOver[i]).scope().$eval(ngModel);
            }else if(value !== ''){
             value = $(elementWithMouseOver[i]).val();
            }else{
              value = '';
            }
            serialize[i] = value;
          };

          return JSON.stringify(serialize);
        }
  
        function getElements(){
          var mouseElements = element.find('[ng-model], [data-ng-model]');
          return mouseElements;
        }

        function addMouseOverEvent(){
         
          getElements().each(function(index,elem){
            elementWithMouseOver.push(elem);
            $(elem).mouseover(elem,mouseOverEvent);
          })
        }

        function addMouseOutEvent(){
          getElements().each(function(index,elem){
            $(elem).mouseout(elem,mouseOutEvent);
          })
        }

        function addFocusEvent(){
          getElements().each(function(index,elem){
            $(elem).focusin(elem,focusEvent);
          })
        }

        function addBlurEvent(){
          getElements().each(function(index,elem){
            $(elem).focusout(elem,blurEvent);
          })
        }

        $timeout(function(){
          addMouseOverEvent();
          addMouseOutEvent();
          addBlurEvent();
          addFocusEvent();
          initSerialize = getSerializeObject();
        },0);        
      }
    };
  }]);
})();
;angular.module('tink.fieldset').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/transclude.html',
    "template"
  );

}]);
