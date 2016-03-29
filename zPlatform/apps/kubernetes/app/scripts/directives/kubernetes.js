define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc directive
   * @name kubernetesApp.directive:kubernetes
   * @description
   * # kubernetes
   */
  angular.module('kubernetesApp.directives.Kubernetesapp', [])
    .directive('appensureUnique', ['$http', function($http) {
        return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c) {
        scope.$watch(attrs.ngModel, function(n) {
        if (!n) return;
        $http({
          method: 'POST',
          url: '/api/v2/appcheck/' + attrs.appensureUnique,
          data: {'appname': n},
          timeout:500,
        }).success(function(data, status, headers, cfg) {
          c.$setValidity('unique', true);
        }).error(function(data, status, headers, cfg) {
          c.$setValidity('unique', false);
        });
      });
    }
  }
}]);
});