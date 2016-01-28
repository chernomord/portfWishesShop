var bannerModule        = angular.module('bannerModule', []),
    catalogueModule     = angular.module('catalogueModule', []),
    itemModule          = angular.module('itemModule', []),
    menuRootModule      = angular.module('menuRootModule', []),
    cartModule          = angular.module('cartModule', []),
    checkOutModule      = angular.module('checkOutModule', []);

var funshopApp = angular.module('funshopApp', [
    'ngAnimate',
    'ngCookies',
    'ui.router',
    'ui.bootstrap',
    'pascalprecht.translate',
    //'ngSanitize',
    'ngTagsInput',
    'catalogueModule',
    'bannerModule',
    'menuRootModule',
    'cartModule',
    'checkOutModule',
    'itemModule'
]);

