define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name kubernetesApp.controller:ModalInstanceCtrlCtrl
     * @description
     * # ModalInstanceCtrlCtrl
     * Controller of the kubernetesApp
     */
    angular.module('kubernetesApp.controllers.ModalInstanceCtrl', [])
        .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, item, title) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.item = item;
            $scope.title = title;
            $scope.Save = function () {
                $uibModalInstance.save($scope.item);
            };

            $scope.Update = function () {
                $uibModalInstance.Update($scope.item);
            };

            $scope.Updateapp = function () {
                $uibModalInstance.Updateapp($scope.item);
            };

            $scope.Delete = function () {
                $uibModalInstance.Delete($scope.item);
            };

            $scope.Start = function () {
                $uibModalInstance.Start($scope.item);
            };

            $scope.Stop = function () {
                $uibModalInstance.Stop($scope.item);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });
});
