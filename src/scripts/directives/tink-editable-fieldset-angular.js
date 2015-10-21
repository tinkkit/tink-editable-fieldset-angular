'use strict';
(function(module) {
  try {
    module = angular.module('tink.fieldset');
  } catch (e) {
    module = angular.module('tink.fieldset', []);
  }
  module.directive('tinkEditableFieldset', [function () {
    return {
      restrict: 'A',
      replace: true,
      link: function(scope,element,attributes) {
        console.log(element)
       
      }
    };
  }]);
})();
