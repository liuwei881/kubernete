/*jshint unused: vars */
define(['angular', 'controllers/main', 'controllers/about', 'directives/paging', 'controllers/login', 'controllers/header', 'controllers/sidebar', 'controllers/pagehead', 'controllers/footer', 'controllers/dashboard', 'services/httpinterceptor', 'controllers/users', 'services/users', 'controllers/modalinstance', 'controllers/task', 'services/taskservice', 'controllers/tasklog', 'services/tasklogservice', 'directives/tasktype', 'controllers/types', 'services/types', 'services/syncservice','controllers/projectserver','services/projectservice','controllers/imageserver','services/imageservice','controllers/appserver','services/appservice']/*deps*/, function (angular, MainCtrl, AboutCtrl, PagingDirective, LoginCtrl, HeaderCtrl, SidebarCtrl, PageHeadCtrl, FooterCtrl, DashboardCtrl, PhysicalCtrl, HttpInterceptorFactory, PhysicalService, UsersCtrl,UsersServices, ModalinstanceCtrl, TaskCtrl, TaskServiceService, TasklogCtrl, TasklogServiceService, TaskTypeDirective, TypesCtrl, TypesService, Syncservice,ProjectServerCtrl,ProjectService,ImageServerCtrl,ImageService,AppServerCtrl,AppService)/*invoke*/ {
    'use strict';

    /**
     * @ngdoc overview
     * @name zCloudApp
     * @description
     * # zCloudApp
     *
     * Main module of the application.
     */
    return angular
        .module('zCloudApp', ['zCloudApp.controllers.MainCtrl',
            'zCloudApp.controllers.AboutCtrl',
            'zCloudApp.directives.Paging',
            'zCloudApp.controllers.LoginCtrl',
            'zCloudApp.controllers.HeaderCtrl',
            'zCloudApp.controllers.SidebarCtrl',
            'zCloudApp.controllers.PageHeadCtrl',
            'zCloudApp.controllers.FooterCtrl',
            'zCloudApp.controllers.DashboardCtrl',
            'zCloudApp.services.HttpInterceptor',
            'zCloudApp.controllers.UsersCtrl',
            'zCloudApp.services.Users',
            'zCloudApp.controllers.ModalInstanceCtrl',
            'zCloudApp.controllers.TaskCtrl',
'zCloudApp.services.TaskService',
'zCloudApp.controllers.TasklogCtrl',
'zCloudApp.services.TasklogService',
'zCloudApp.directives.TaskType',
'zCloudApp.controllers.TypesCtrl',
'zCloudApp.services.Types',
'zCloudApp.services.Syncservice',
'zCloudApp.controllers.ProjectServerCtrl',
'zCloudApp.services.ProjectService',
'zCloudApp.controllers.ImageServerCtrl',
'zCloudApp.services.ImageService',
'zCloudApp.controllers.AppServerCtrl',
'zCloudApp.services.AppService',
/*angJSDeps*/
            'ngCookies',
            'ngSanitize',
            'ngAnimate',
            'ui.router'
        ])
        .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
            $httpProvider.interceptors.push('httpInterceptor');
            $stateProvider
                .state('dashboard', {
                    url: '/',
                    templateUrl: 'views/main.html',
                    nav: 'DashHome'
                })
                .state('dashboard.home', {
                    url: '/dashboard',
                    templateUrl: 'views/dashboard.html',
                    controller: 'DashboardCtrl',
                    nav: 'DashBoard'
                })
                .state('dashboard.project', {
                    url: 'projects',
                    templateUrl: 'views/projects.html',
                    controller: 'ProjectServerCtrl',
                    nav: '项目构建',
                    needRequest: true
                })
                .state('dashboard.image', {
                    url: 'images',
                    templateUrl: 'views/image.html',
                    controller: 'ImageServerCtrl',
                    nav: '镜像仓库',
                    needRequest: true
                })
                .state('dashboard.app', {
                    url: 'apps',
                    templateUrl: 'views/app.html',
                    controller: 'AppServerCtrl',
                    nav: '应用列表',
                    needRequest: true
                })
                .state('login',{
                    url: '/login',
                    templateUrl: 'views/login.html',
                    controller: 'LoginCtrl'
                })
                .state('logout',{
                    url: '/logout',
                    controller: function($cookies,$state){
                        $cookies.remove('user');
                        $state.go('login');
                    }
                })
            $urlRouterProvider.otherwise('/');
        })
        .run(function ($rootScope, $state, $stateParams, $cookies) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$on('$stateChangeStart', function (event, toState, fromState) {
                if (toState.url === '/login') {
                    $('body').addClass('login');
                } else {
                    $('body').removeClass('login');
                    if ($cookies.get('user') === undefined) {
                        event.preventDefault();
                        $state.go('login');
                    }
                }
            });
        });
    ;
});
