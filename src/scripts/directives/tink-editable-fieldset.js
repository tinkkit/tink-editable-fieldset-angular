'use strict';
(function(module) {
  try {
    module = angular.module('tink.fieldset');
  } catch (e) {
    module = angular.module('tink.fieldset', []);
  }
  module.directive('tinkFieldset', ['safeApply','$timeout','$compile',function (safeApply,$timeout,$compile) {
    return {
      restrict: 'A',
      scope: {
        tinkFormEditable:'=?',
        tinkFormStatus:'=?'
      },
      compile:function(template){
        return {
        post: function () { },
        pre: function (scope, element, attr) {
        var disabledReady=[];

        function disabledAtStart(){
          getElements().each(function(index,elem){
              if($(elem).attr('disabled') || $(elem).scope().isDisabled){
                disabledReady.push($(elem).get(0));
              }
          })
        }
        var activeElement = null;
        var initSerialize;
        var focus = 0;

        var elementWithMouseOver = [];
        var classToSetWhenOnHover = "mouseOver";
        var classToSetWhenDefault = "mouseOff";
        var classToSetWhenActive = "mouseFocus";
        var cssUneditableClass = "uneditable";

        setClassActive(classToSetWhenDefault);

        var activeClass = '';
        function setClassActive(cssClass,elem){
          safeApply(scope,function(){
            $timeout(function() {
              if((activeElement === $(elem).get(0) || activeElement === null)){
                $(element).removeClass(classToSetWhenOnHover);
                $(element).removeClass(classToSetWhenDefault);
                $(element).removeClass(classToSetWhenActive);
                $(element).removeClass(cssUneditableClass);
                $(element).addClass(cssClass);
                activeClass = cssClass;
                scope.tinkFormStatus = cssClass;
              }
            }, 10);
            
          })
        }

         function checkIfIsEditable(){
          return $(template).hasClass(cssUneditableClass);          
        }

        scope.$watch('tinkFormEditable',function(value){
          if(!value){
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
          var isDisabled = targetEl.attr('disabled') || targetEl.attr('data-disabled') || targetEl.attr('is-disabled') || targetEl.attr('data-is-disabled');
          if(isDisabled){
            return true;
          }
          return false;
        }

        function mouseOverEvent(e,elem){
          safeApply(scope,function(){
              if(activeClass !== classToSetWhenActive && !isDisabled(e.target)){
                activeElement = $(e.target).get(0);
                setClassActive(classToSetWhenOnHover,$(e.target).get(0));
              }
          })
        }

        function mouseOutEvent(e,elem){
          safeApply(scope,function(){
              if(activeClass !== classToSetWhenActive && !isDisabled(e.target)){
                setClassActive(classToSetWhenDefault,$(e.target).get(0));
               // activeElement = null;
              }
          })          
        }

        function blurEvent(e,elem){
          safeApply(scope,function(){
            $timeout(function(){
              setClassActive(classToSetWhenDefault,$(e.target).get(0));         
            },10);
          })  
        }

        function focusEvent(e){
          safeApply(scope,function(){
              activeElement = $(e.target).get(0);
              setClassActive(classToSetWhenActive,$(e.target).get(0));
          });
        }

        function getElements(){
          var mouseElements = element.find('[ng-model], [data-ng-model]');
          return mouseElements;
        }

        function addEventsToElements(){
          getElements().each(function(index,elem){
            scope.addEvents($(elem));
          })
        }

        scope.addEvents = function(elem){
          $(elem).focusin(elem,focusEvent);
          $(elem).mouseover(elem,mouseOverEvent);
          $(elem).mouseout(elem,mouseOutEvent);          
          $(elem).focusout(elem,blurEvent);
        }
        scope.removeEvents = function(elem){
          $(elem).unbind('mouseover mouseout focusin focusout');
        }

         addEventsToElements(); 
      }
    };
  }
    };
  }]);
})();