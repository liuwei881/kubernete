define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc service
   * @name zCloudApp.ImageService
   * @description
   * # ImageService
   * Service in the zCloudApp.
   */
  angular.module('zCloudApp.services.ImageService', [])
	.service('ImageService', function ($http) {
	    // AngularJS will instantiate a singleton by calling "new" on this function
	    function fetch(params) {
            return $http.get('/api/image', {params: params});
        }

        function save(params) {
            if (params.ImageId != undefined) {
                return $http.put('/api/image/' + params.ImageId, {params: params})
            } else {
                return $http.post('/api/image', {params: params})
            }
        }

        function saveApp(params) {
            if (params.AppName === undefined) {
                return $http.post('/api/app/')
            } else {
                return $http.post('/api/app', {params: params})
            }
        }

        function Delete(params) {
            return $http.delete('/api/image/' + params.ImageId);
        }

        function Start(params) {
            return $http.start('/api/image/' + params.ImageId);
        }

        function Stop(params) {
            return $http.stop('/api/image/' + params.ImageId);
        }


        return {
            fetch: fetch,
            save: save,
            Delete: Delete,
            saveApp: saveApp,
            Start: Start,
            Stop: Stop
        }
	});
});
