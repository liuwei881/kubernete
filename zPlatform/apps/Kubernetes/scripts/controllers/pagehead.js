define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name zCloudApp.controller:PageHeadCtrl
     * @description
     * # PageHeadCtrl
     * Controller of the zCloudApp
     */
    angular.module('zCloudApp.controllers.PageHeadCtrl', [])
        .controller('PageHeadCtrl', function ($scope) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
        });
});
