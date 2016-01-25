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
        pre: function (scope, element) {
        var disabledReady=[];

        var activeElement = null;

        var classToSetWhenOnHover = 'mouseOver';
        var classToSetWhenDefault = 'mouseOff';
        var classToSetWhenActive = 'mouseFocus';
        var cssUneditableClass = 'uneditable';

        setClassActive(classToSetWhenDefault,null);

        var activeClass = '';
        function setClassActive(cssClass,elem){
          safeApply(scope,function(){
            $timeout(function() {
              if((activeElement === $(elem).get(0) || elem === null)){
                $(element).removeClass(classToSetWhenOnHover);
                $(element).removeClass(classToSetWhenDefault);
                $(element).removeClass(classToSetWhenActive);
                $(element).removeClass(cssUneditableClass);
                $(element).addClass(cssClass);
                activeClass = cssClass;
                scope.tinkFormStatus = cssClass;
              }
            }, 10);
            
          });
        }

        setClassActive(classToSetWhenDefault);
        scope.formFocus = 0;
        $(element).bind('mousedown.'+scope.$id,function(){
            safeApply(scope,function(){
              if(scope.formFocus === 0){
                $('body').bind('mousedown.'+scope.$id,function(e){
                //var target = $(e.target);
                  if($(element).get(0) !== $(e.target).get(0) && $(element).find($(e.target)).length === 0 && !$(e.target).is('[editable-focus]')){
                    scope.formFocus = 0;
                     $('body').unbind('mousedown.'+scope.$id);
                     activeElement = $(element).get(0);
                     setClassActive(classToSetWhenDefault,$(element).get(0));
                  }
              });
            }          
            scope.formFocus = 1;
          });
        });

        scope.$watch('tinkFormEditable',function(value){
          if(!value){
            $(template).addClass(cssUneditableClass); 
            getElements().each(function(index,elem){  
              safeApply(scope,function(){
                if($(elem).isolateScope()){
                  $(elem).isolateScope().isDisabled = true;
                }  
                $(elem).attr('disabled','true');
                //specialElementsFix($(elem),false);
              });           
            });
          }else{
            $(template).removeClass(cssUneditableClass);
            getElements().each(function(index,elem){
              if(disabledReady.indexOf($(elem).get(0)) === -1){
                safeApply(scope,function(){
                  if($(elem).isolateScope()){
                    $(elem).isolateScope().isDisabled = false;
                  }                  
                  $(elem).removeAttr('disabled');
                  //specialElementsFix($(elem),true);
                });  
              }              
            });
          }
        });

        /*function specialElementsFix(element,enable){
          if($(element).is('select')){
            elementSelectFix(element,enable);
          }
        }*/

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
          var itIsDisabled = targetEl.attr('disabled') || targetEl.attr('data-disabled') || targetEl.attr('is-disabled') || targetEl.attr('data-is-disabled');
          if(itIsDisabled){
            return true;
          }
          return false;
        }

        function mouseOverEvent(e){
          safeApply(scope,function(){
              if(activeClass !== classToSetWhenActive && !isDisabled(e.target)){
                activeElement = $(e.target).get(0);
                setClassActive(classToSetWhenOnHover,$(e.target).get(0));
              }
          });
        }

        function mouseOutEvent(e){
          safeApply(scope,function(){
              if(activeClass !== classToSetWhenActive && !isDisabled(e.target)){
                setClassActive(classToSetWhenDefault,$(e.target).get(0));
               // activeElement = null;
              }
          });      
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
          });
        }

        scope.addEvents = function(elem){
          $(elem).focusin(elem,focusEvent);
          $(elem).mouseover(elem,mouseOverEvent);
          $(elem).mouseout(elem,mouseOutEvent);          
        };
        scope.removeEvents = function(elem){
          $(elem).unbind('mouseover mouseout focusin');
        };
        
        scope.setClassActive = function(clss,elem){
          setClassActive(clss,elem)
        }

         addEventsToElements(); 
      }
    };
  }
    };
  }]);
})();