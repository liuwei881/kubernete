define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name zCloudApp.controller:ProjectServerCtrl
   * @description
   * # ProjectServerCtrl
   * Controller of the zCloudApp
   */
  var app = angular.module('zCloudApp.controllers.ProjectServerCtrl', ['highcharts-ng']);

    app.directive('ensureUnique', ['$http', function($http) {
        return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c) {
        scope.$watch(attrs.ngModel, function(n) {
        if (!n) return;
        $http({
          method: 'POST',
          url: '/api/check/' + attrs.ensureUnique,
          data: {'projectname': n},
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

    app.controller('ProjectServerCtrl', function (ProjectService, $scope, $state, $modal,Syncservice) {
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
            ProjectService.fetch({page: $scope.page, pageSize: $scope.pageSize, searchKey:searchKey}).
                success(function (data) {
                    $scope.searchKey = searchKey;
                    $scope.total = data.total;
                    $scope.rows = data.rows;
                    $scope.username = data.username;
                });
        };

        if ($state.current.needRequest) {
            $scope.initPage();
        }

        $scope.Create = function () {
            var allImage = JSON.parse(Syncservice.fetch('/api/mirror/'));
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'add.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    item: function () {
                        return {};
                    },
                    title: function () {
                        return {'title':'新建','etcTaskType':etcTaskType,'etcIsDisabled':etcIsDisabled,'imageList':allImage};
                    }
                }
            });
            modalInstance.save = function (item) {console.log(item);
                ProjectService.save(item).
                    success(function (data) {
                        modalInstance.close();
                        $scope.initPage();
                    });
            };
        };

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

        $scope.updateimage = function (i) {
            var allImage = JSON.parse(Syncservice.fetch('/api/mirror/'));
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'updateimage.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.rows[i];
                    },
                    title: function () {
                        return {'title':'升级镜像','imageList':allImage};
                    }
                }
            });
            modalInstance.Update = function (item) {console.log(item);
                ProjectService.Update(item).
                    success(function (data) {
                        modalInstance.close();
                        $scope.initPage();
                    });
            };
        };

        $scope.projectdetail = function (i) {
            $modal.open({
                animation: true,
                templateUrl: 'projectdetail.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.rows[i];
                    },
                    title: function () {
                        return '查看项目信息';
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
                ProjectService.save(item).
                    success(function (data) {
                    console.log(item);
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
                ProjectService.Delete(item).
                    success(function (data) {
                    console.log(item);
                        modalInstance.close();
                        $scope.initPage();
                    });
            };
        };

        $scope.Start = function (item) {
             ProjectService.Start(item).
                success(function (data) {
                   console.log(item);
                     $scope.initPage();
                });
        };

        $scope.Search = function (searchKey) {
            $scope.initPage(searchKey);
        };

        $scope.pageAction = function (page) {
            ProjectService
                .fetch({page: page})
                .success(function (data) {
                    $scope.total = data.total;
                    $scope.rows = data.rows;
                });
        };

        $scope.sendReq = function(id, val){
         ProjectService.post('/api/update/rc/' + id, {"rc": val}).then(function(result){
            result.data;
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
