define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name zCloudApp.controller:FooterCtrl
     * @description
     * # FooterCtrl
     * Controller of the zCloudApp
     */
    angular.module('zCloudApp.controllers.FooterCtrl', [])
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
