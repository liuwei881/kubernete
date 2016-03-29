define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name zCloudApp.controller:AboutCtrl
     * @description
     * # AboutCtrl
     * Controller of the zCloudApp
     */
    angular.module('zCloudApp.controllers.AboutCtrl', [])
        .controller('AboutCtrl', function ($scope) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
        });
});
