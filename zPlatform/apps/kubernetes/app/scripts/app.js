/*jshint unused: vars */
define(['angular', 'controllers/main', 'controllers/about', 'directives/paging', 'controllers/login', 'controllers/header', 'controllers/sidebar', 'controllers/pagehead', 'controllers/footer', 'controllers/dashboard', 'services/httpinterceptor', 'controllers/users', 'services/users', 'controllers/modalinstance', 'services/syncservice','controllers/projectserver','services/projectservice','controllers/imageserver','services/imageservice','controllers/appserver','services/appservice', 'directives/kubernetes','directives/kubernetesproject']/*deps*/, function (angular, MainCtrl, AboutCtrl, PagingDirective, LoginCtrl, HeaderCtrl, SidebarCtrl, PageHeadCtrl, FooterCtrl, DashboardCtrl, PhysicalCtrl, HttpInterceptorFactory, PhysicalService, UsersCtrl,UsersServices, ModalinstanceCtrl, Syncservice,ProjectServerCtrl,ProjectService,ImageServerCtrl,ImageService,AppServerCtrl,AppService, KubernetesDirective,KubernetesprojectDirective)/*invoke*/ {
    'use strict';

    /**
     * @ngdoc overview
     * @name kubernetesApp
     * @description
     * # kubernetesApp
     *
     * Main module of the application.
     */
    return angular
        .module('kubernetesApp', ['kubernetesApp.controllers.MainCtrl',
            'kubernetesApp.controllers.AboutCtrl',
            'kubernetesApp.directives.Paging',
            'kubernetesApp.controllers.LoginCtrl',
            'kubernetesApp.controllers.HeaderCtrl',
            'kubernetesApp.controllers.SidebarCtrl',
            'kubernetesApp.controllers.PageHeadCtrl',
            'kubernetesApp.controllers.FooterCtrl',
            'kubernetesApp.controllers.DashboardCtrl',
            'kubernetesApp.services.HttpInterceptor',
            'kubernetesApp.controllers.UsersCtrl',
            'kubernetesApp.services.Users',
            'kubernetesApp.controllers.ModalInstanceCtrl',
            'kubernetesApp.services.Syncservice',
            'kubernetesApp.controllers.ProjectServerCtrl',
            'kubernetesApp.services.ProjectService',
            'kubernetesApp.controllers.ImageServerCtrl',
            'kubernetesApp.services.ImageService',
            'kubernetesApp.controllers.AppServerCtrl',
            'kubernetesApp.services.AppService',
'kubernetesApp.directives.Kubernetesapp',
'kubernetesApp.directives.Kubernetesproject',
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
