define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc directive
   * @name kubernetesApp.directive:taskType
   * @description
   * # taskType
   */
  angular.module('kubernetesApp.directives.TaskType', [])
    .directive('taskType', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/view/task.html',
        link: function (scope, element, attrs) {
            scope.Type = attrs.Type;
        }
      };
    });
});
