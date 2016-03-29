define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name zCloudApp.controller:ImageServerCtrl
   * @description
   * # ImageServerCtrl
   * Controller of the zCloudApp
   */
  var imageapp = angular.module('zCloudApp.controllers.ImageServerCtrl', ['highcharts-ng']);
    imageapp.directive('appensureUnique', ['$http', function($http) {
        return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c) {
        scope.$watch(attrs.ngModel, function(n) {
        if (!n) return;
        $http({
          method: 'POST',
          url: '/api/appcheck/' + attrs.appensureUnique,
          data: {'appname': n},
          timeout:500,
        }).success(function(data, status, headers, cfg) {
          c.$setValidity('unique', true);
        }).error(function(data, status, headers, cfg) {
          c.$setValidity('unique', false);
        });
      });
    }
  }
}]);
    imageapp.controller('ImageServerCtrl', function (ImageService, $scope, $state, $modal) {
      this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];

        $scope.total = 0;
        $scope.pageSize = 15;
        $scope.page = 1;
        $scope.searchKey = '';
        $scope.initPage = function(searchKey){
            ImageService.fetch({page: $scope.page, pageSize: $scope.pageSize, searchKey:searchKey}).
                success(function (data) {
                    $scope.searchKey = searchKey;
                    $scope.total = data.total;
                    $scope.rows  = data.rows;
                });
        };

        if ($state.current.needRequest) {
            $scope.initPage();
        }

        $scope.detail = function (i) {
            $modal.open({
                animation: true,
                templateUrl: 'detail.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.rows[i];
                    },
                    title: function () {
                        return '查看';
                    }
                }
            });
        };

        $scope.edit = function (i) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'edit.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.rows[i];
                    },
                    title: function () {
                        return {'title':'编辑','etcTaskType':etcTaskType,'etcIsDisabled':etcIsDisabled};
                    }
                }
            });
           modalInstance.save = function (item) {
                ImageService.save(item).
                    success(function (data) {
                    console.log(item);
                        modalInstance.close();
                        $scope.initPage();
                    });
            };
        };

        $scope.addApp = function (ImageId) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/server/addApp.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    item: function () {
                        return {'ImageId':ImageId};
                    },
                    title: function () {
                        return {'title':'创建应用','etcTaskType':etcTaskType,'etcIsDisabled':etcIsDisabled};
                    }
                }
            });
            modalInstance.save = function (item) {
                ImageService.saveApp(item).
                    success(function (data) {
                        modalInstance.close();
                        $scope.initPage();
                    });
            };
        };

            $scope.Delete = function (i) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'delete.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.rows[i];
                    },
                    title: function () {
                        return {'title':'删除','etcTaskType':etcTaskType,'etcIsDisabled':etcIsDisabled};
                    }
                }
            });
           modalInstance.Delete = function (item) {
                ImageService.Delete(item).
                    success(function (data) {
                    console.log(item);
                        modalInstance.close();
                        $scope.initPage();
                    });
            };
        };

        $scope.Start = function (item) {
             ImageService.Start(item).
                success(function (data) {
                   console.log(item);
                     $scope.initPage();
                });
        };

        $scope.Search = function (searchKey) {
            $scope.initPage(searchKey);
        };

        $scope.pageAction = function (page) {
            ImageService
                .fetch({page: page})
                .success(function (data) {
                    $scope.total = data.total;
                    $scope.rows = data.rows;
                });
        };

    }).filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }
            return value + (tail || '...');
        };
    });;
});
