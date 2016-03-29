define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc service
   * @name zCloudApp.ServerService
   * @description
   * # PorjectService
   * Service in the zCloudApp.
   */
  angular.module('zCloudApp.services.ProjectService', [])
	.service('ProjectService', function ($http) {
	    // AngularJS will instantiate a singleton by calling "new" on this function
	    function fetch(params) {
            return $http.get('/api/projects', {params: params});
        }

        function save(params) {
            if (params.ProjectName === undefined) {
                return $http.post('/api/projects')
            } else {
                return $http.post('/api/projects', {params: params})
            }
        }

        function Update(params) {
            return $http.post('/api/update/' + params.ProjectId,{params: params});
        }

        function Delete(params) {
            return $http.delete('/api/projects/' + params.ProjectId);
        }

        function Start(params) {
            return $http.start('/api/projects/' + params.ProjectId);
        }

        function Stop(params) {
            return $http.stop('/api/projects/' + params.ProjectId);
        }

        function post(url, params) {
            return $http.post(url, {params: params})
        }

        return {
            fetch: fetch,
            save: save,
            Update: Update,
            Delete: Delete,
            Start: Start,
            Stop: Stop,
            post: post
        }
	});
});
