define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name kubernetesApp.controller:FooterCtrl
     * @description
     * # FooterCtrl
     * Controller of the kubernetesApp
     */
    angular.module('kubernetesApp.controllers.FooterCtrl', [])
        .controller('FooterCtrl', function ($scope) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.$on('$includeContentLoaded', function () {
                Layout.initFooter(); // init footer
            });
        });
});
