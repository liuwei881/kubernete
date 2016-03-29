define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name zCloudApp.controller:SidebarCtrl
     * @description
     * # SidebarCtrl
     * Controller of the zCloudApp
     */
    angular.module('zCloudApp.controllers.SidebarCtrl', [])
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
