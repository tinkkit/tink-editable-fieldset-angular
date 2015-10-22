'use strict';
(function(module) {
  try {
    module = angular.module('tink.fieldset');
  } catch (e) {
    module = angular.module('tink.fieldset', []);
  }
  module.directive('tinkFieldset', [function () {
    return {
      restrict: 'A',
      scope: {
        valuesChanged: '='
      },
      require:'form',
      link: function(scope,element,attr) {

   
        var initSerialize;


        var elementWithMouseOver = [];
        var classToSetWhenOnHover = "mouseOver";

        function mouseOverEvent(e,elem){
          $(element).addClass(classToSetWhenOnHover);
        }

        function mouseOutEvent(e,elem){
          $(element).removeClass(classToSetWhenOnHover);
        }

        function blurEvent(e,elem){
          if(initSerialize !== getSerializeObject()){
            scope.valuesChanged = true;
          }else{
            scope.valuesChanged = false;
          }
        }

        function getSerializeObject(){console.log(scope.$parent.form)
          var serialize = {};
          for (var i = elementWithMouseOver.length - 1; i >= 0; i--) {
            var ngModel = $(elementWithMouseOver[i]).attr('ng-model');
            var value = scope.$parent.$eval(ngModel) || $(elementWithMouseOver[i]).val();
            serialize[i] = value;
          };

          return JSON.stringify(serialize);
        }
  
        function getElements(){
          var mouseElements = element.find('[ng-model], [data-ng-model]');
          console.log(mouseElements);
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

        function addBlurEvent(){
          getElements().each(function(index,elem){
            $(elem).blur(elem,blurEvent);
          })
        }
        
        addMouseOverEvent();
        addMouseOutEvent();
        addBlurEvent();
        initSerialize = getSerializeObject();
      }
    };
  }]);
})();
