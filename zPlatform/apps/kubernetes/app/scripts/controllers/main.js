define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name kubernetesApp.controller:MainCtrl
     * @description
     * # MainCtrl
     * Controller of the kubernetesApp
     */
    angular.module('kubernetesApp.controllers.MainCtrl', [])
        .controller('MainCtrl', function ($scope) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
        });
});
