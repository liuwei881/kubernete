define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name kubernetesApp.controller:HeaderCtrl
     * @description
     * # HeaderCtrl
     * Controller of the kubernetesApp
     */
    angular.module('kubernetesApp.controllers.HeaderCtrl', [])
        .controller('HeaderCtrl', function ($scope,$cookies,$state) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.$on('$includeContentLoaded', function () {
                Layout.initHeader();
            });
            $scope.Login = function() {
                $cookies.remove('user');
                $state.go('login');
            };

        });
});
