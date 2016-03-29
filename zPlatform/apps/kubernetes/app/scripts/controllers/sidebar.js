define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name kubernetesApp.controller:SidebarCtrl
     * @description
     * # SidebarCtrl
     * Controller of the kubernetesApp
     */
    angular.module('kubernetesApp.controllers.SidebarCtrl', [])
        .controller('SidebarCtrl', function ($scope) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.$on('$includeContentLoaded', function () {
                Layout.initSidebar();
            });
        });
});
