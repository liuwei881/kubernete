define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name zCloudApp.controller:ModalInstanceCtrlCtrl
     * @description
     * # ModalInstanceCtrlCtrl
     * Controller of the zCloudApp
     */
    angular.module('zCloudApp.controllers.ModalInstanceCtrl', [])
        .controller('ModalInstanceCtrl', function ($scope, $modalInstance, item, title) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.item = item;
            $scope.title = title;
            $scope.Save = function () {
                $modalInstance.save($scope.item);
            };

            $scope.Update = function () {
                $modalInstance.Update($scope.item);
            };

            $scope.Updateapp = function () {
                $modalInstance.Updateapp($scope.item);
            };

            $scope.Delete = function () {
                $modalInstance.Delete($scope.item);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
});
