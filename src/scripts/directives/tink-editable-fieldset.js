'use strict';
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

        function mouseOverEvent(e,elem){
          safeApply(scope,function(){
            $(element).addClass(classToSetWhenOnHover);
          })
        }

        function mouseOutEvent(e,elem){
          safeApply(scope,function(){
            if(!focus){
              $(element).removeClass(classToSetWhenOnHover);
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
              $(element).removeClass(classToSetWhenOnHover);
            },0);
          })  
        }

        function focusEvent(){
          safeApply(scope,function(){
            focus = 1;
            $(element).addClass(classToSetWhenOnHover);
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
