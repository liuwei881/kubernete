define(['angular'], function (angular) {
    'use strict';

    /**
     * @ngdoc service
     * @name zCloudApp.Users
     * @description
     * # Users
     * Service in the zCloudApp.
     */
    angular.module('zCloudApp.services.Users', [])
        .service('Users', function ($http) {
            // AngularJS will instantiate a singleton by calling "new" on this function
            function fetch(params) {
                return $http.get('/api/users', {params: params});
            }

            function save(params) {
                if (params.UsersId != undefined) {
                    return $http.put('/api/users' + params.UserId, {params: params})
                } else {
                    return $http.post('/api/users', {params: params})
                }
            }

            function Delete(id) {
                return $http.delete('/api/users/' + id);
            }

            return {
                fetch: fetch,
                save: save,
                Delete: Delete
            }
        });
});
