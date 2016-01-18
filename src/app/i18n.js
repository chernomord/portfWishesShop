funshopApp.config(['$translateProvider','$translatePartialLoaderProvider',
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
    }
]);

funshopApp.run(['$rootScope', '$translate',
    function ($rootScope, $translate) {
        $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
            $translate.refresh();
        });
    }
]);