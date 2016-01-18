var bannerModule        = angular.module('banner', []),
    catalogueModule     = angular.module('catalogueModule', []),
    menuRootModule      = angular.module('menuRootModule', []),
    cartModule          = angular.module('cartModule', []),
    checkOutModule      = angular.module('checkOutModule', []);

var funshopApp = angular.module('funshopApp', [
    'ngCookies',
    'ui.router',
    'ui.bootstrap',
    'pascalprecht.translate',
    //'ngSanitize',
    'ngTagsInput',
    'catalogueModule',
    'banner',
    'menuRootModule',
    'cartModule',
    'checkOutModule'
]);

