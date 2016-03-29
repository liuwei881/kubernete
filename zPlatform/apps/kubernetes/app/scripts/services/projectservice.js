define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc service
   * @name kubernetesApp.ServerService
   * @description
   * # PorjectService
   * Service in the kubernetesApp.
   */
  angular.module('kubernetesApp.services.ProjectService', [])
	.service('ProjectService', function ($http) {
	    // AngularJS will instantiate a singleton by calling "new" on this function
	    function fetch(params) {
            return $http.get('/api/v2/projects', {params: params});
        }

        function save(params) {
            if (params.ProjectName === undefined) {
                return $http.post('/api/v2/projects')
            } else {
                return $http.post('/api/v2/projects', {params: params})
            }
        }

        function Update(params) {
            return $http.post('/api/v2/update/' + params.ProjectId,{params: params});
        }

        function Delete(params) {
            return $http.delete('/api/v2/projects/' + params.ProjectId);
        }

        function Start(params) {
            return $http.get('/api/v2/projects/start/' + params.ProjectId);
        }

        function Stop(params) {
            return $http.get('/api/v2/projects/stop/' + params.ProjectId);
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
