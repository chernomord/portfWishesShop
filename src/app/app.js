/**
 * Created by Slava on 19.11.2015.
 */

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

funshopApp.config([
    '$translateProvider',
    '$translatePartialLoaderProvider',
    function ($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider
        //.uniformLanguageTag('bcp47')
        .registerAvailableLanguageKeys(['en', 'ru'], {
            'en_*': 'en',
            'ru_*': 'ru'
        })
        .determinePreferredLanguage()
        .fallbackLanguage('en')
        .useCookieStorage()
        .useLoader('$translatePartialLoader', {
            urlTemplate: 'i18n/{part}/{lang}.json'
        })
        .useLoaderCache(true)
        .useSanitizeValueStrategy('escape');
    $translatePartialLoaderProvider.addPart('Banner', 'MenuRoot', 'Catalogue');
}]);

funshopApp.run(function ($rootScope, $translate) {
    $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
        $translate.refresh();
    });
});