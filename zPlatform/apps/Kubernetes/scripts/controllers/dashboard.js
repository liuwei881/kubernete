define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name zCloudApp.controller:DashboardCtrl
     * @description
     * # DashboardCtrl
     * Controller of the zCloudApp
     */
    angular.module('zCloudApp.controllers.DashboardCtrl', [])
        .controller('DashboardCtrl', function ($scope) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
        });
});
