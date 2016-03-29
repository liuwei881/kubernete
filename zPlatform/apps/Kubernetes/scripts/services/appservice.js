define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc service
   * @name zCloudApp.ImageService
   * @description
   * # ImageService
   * Service in the zCloudApp.
   */
  angular.module('zCloudApp.services.AppService', [])
	.service('AppService', function ($http) {
	    // AngularJS will instantiate a singleton by calling "new" on this function
	    function fetch(params) {
            return $http.get('/api/app', {params: params});
        }

        function save(params) {
            if (params.AppId != undefined) {
                return $http.put('/api/app/' + params.AppId, {params: params})
            } else {
                return $http.post('/api/app', {params: params})
            }
        }

        function Updateapp(params) {
            return $http.post('/api/updateapp/' + + params.AppId,{params: params});
        }

        function Delete(params) {
            return $http.delete('/api/app/' + params.AppId);
        }

        function Start(params) {
            return $http.start('/api/app/' + params.AppId);
        }

        function Stop(params) {
            return $http.stop('/api/app/' + params.AppId);
        }

        function post(url, params) {
            return $http.post(url, {params: params})
        }

        return {
            fetch: fetch,
            save: save,
            Updateapp:Updateapp,
            Delete: Delete,
            Start: Start,
            Stop: Stop,
            post:post
        }
	});
});
