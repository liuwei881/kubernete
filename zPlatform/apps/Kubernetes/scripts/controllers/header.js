define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name zCloudApp.controller:HeaderCtrl
     * @description
     * # HeaderCtrl
     * Controller of the zCloudApp
     */
    angular.module('zCloudApp.controllers.HeaderCtrl', [])
        .controller('HeaderCtrl', function ($scope,$cookies,$state) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.$on('$includeContentLoaded', function () {
                Layout.initHeader();
            });
            $scope.Login = function() {
                $cookies.remove('user');
                $state.go('login');
            };

        });
});
