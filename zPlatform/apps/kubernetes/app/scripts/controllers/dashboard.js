define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name kubernetesApp.controller:DashboardCtrl
     * @description
     * # DashboardCtrl
     * Controller of the kubernetesApp
     */
    angular.module('kubernetesApp.controllers.DashboardCtrl', [])
        .controller('DashboardCtrl', function ($scope) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
        });
});
