var bannerModule = angular.module('banner', []);
var catalogueModule = angular.module('catalogueModule', []);
var menuRootModule = angular.module('menuRootModule', []);

var funshopApp = angular.module('funshopApp', [
    'ngCookies',
    'ui.router',
    'ui.bootstrap',
    'pascalprecht.translate',
    //'ngSanitize',
    'ngTagsInput',
    'catalogueModule',
    'banner',
    'menuRootModule'
]);

