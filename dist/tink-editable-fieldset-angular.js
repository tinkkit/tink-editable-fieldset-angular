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
   'tink.nationalnumber',
   'awelzijn.directives'
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
    this.switchValue = false;
    this.switch = function(){
      this.switchValue = ! this.switchValue;
    }
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
  module.directive('tinkFieldset', ['safeApply','$timeout','$compile',function (safeApply,$timeout,$compile) {
    return {
      restrict: 'A',
      priority:0,
      scope: {
        valuesChanged: '=',
        tinkFormEditable:'='
      },
      require:'form',
      compile:function(template){
        var cssUneditableClass = "uneditable";

        function getElements(){
          var mouseElements = $(template).find('[ng-model], [data-ng-model], tink-datepicker-range, data-tink-datepicker-range');
          return mouseElements;
        }
        $(template).find('select').on('mousedown',function(){console.log('ok')})

        /*function checkIfIsEditable(){
          if($(template).hasClass(cssUneditableClass)){
            getElements().each(function(index,elem){
              $(elem).attr('is-disabled','true');
              $(elem).attr('disabled','true');
            })
          }
        }
          checkIfIsEditable();    */ 

        return {
        pre: function () { },
        post: function (scope, element, attr) {
        var disabledReady=[];

        function disabledAtStart(){
          getElements().each(function(index,elem){
              if($(elem).attr('disabled') || $(elem).scope().isDisabled){
                disabledReady.push($(elem).get(0));
              }
          })
        }
        disabledAtStart();
   
        var initSerialize;
        var focus = 0;

        var elementWithMouseOver = [];
        var classToSetWhenOnHover = "mouseOver";
        var classToSetWhenDefault = "mouseOff";
        var classToSetWhenActive = "mouseFocus";
        var cssUneditableClass = "uneditable";

        setClassActive(classToSetWhenDefault);

        var activeClass = '';
        function setClassActive(cssClass){
          
          if(cssClass !== activeClass){
            $(element).removeClass(activeClass);
            $(element).addClass(cssClass);
            activeClass = cssClass;
          }
        }

         function checkIfIsEditable(){
          return $(template).hasClass(cssUneditableClass);          
        }

        scope.$watch('tinkFormEditable',function(value){
          if(value){
            $(template).addClass(cssUneditableClass); 
            getElements().each(function(index,elem){  
              safeApply(scope,function(){
                if($(elem).isolateScope()){
                  $(elem).isolateScope().isDisabled = true;
                }  
                $(elem).attr('disabled','true');
                specialElementsFix($(elem),false);
              });           
            })
          }else{
            $(template).removeClass(cssUneditableClass);
            getElements().each(function(index,elem){
              if(disabledReady.indexOf($(elem).get(0)) === -1){
                safeApply(scope,function(){
                  if($(elem).isolateScope()){
                    $(elem).isolateScope().isDisabled = false;
                  }                  
                  $(elem).removeAttr('disabled');
                  specialElementsFix($(elem),true);
                });  
              }              
            })
          }
        })

        function specialElementsFix(element,enable){
          if($(element).is('select')){
            elementSelectFix(element,enable);
          }
        }

        function elementSelectFix(element,enable){
          if(!enable){
            element.css('display','none');
            var model = element.attr('ng-model') || element.attr('data-ng-model');
            var input = $('<input type="text" disabled ng-model="'+model+'"/>');
            //input.css('height',element.outerHeight());
            input = $compile(input)(scope.$parent);
            input.insertAfter(element); 
          }else{
            element.css('display','block');
            if(element.next().is('input')){
              element.next().remove();
            }
          }
        }

        function isDisabled(elem){
          var targetEl = $(elem);
          var isDisabled = targetEl.attr('disabled') || targetEl.attr('data-disabled') || targetEl.attr('is-disabled');
          if(isDisabled){
            return true;
          }
          return false;
        }

        function mouseOverEvent(e,elem){
          safeApply(scope,function(){
            if(activeClass !== classToSetWhenActive && !isDisabled(e.target)){
              setClassActive(classToSetWhenOnHover);
            }
          })
        }

        function mouseOutEvent(e,elem){
          safeApply(scope,function(){
            if(activeClass !== classToSetWhenActive && !isDisabled(e.target)){
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
