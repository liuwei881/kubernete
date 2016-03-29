define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name zCloudApp.controller:MainCtrl
     * @description
     * # MainCtrl
     * Controller of the zCloudApp
     */
    angular.module('zCloudApp.controllers.MainCtrl', [])
        .controller('MainCtrl', function ($scope) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
        });
});
