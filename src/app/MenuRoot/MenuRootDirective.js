menuRootModule.directive('menuRoot', function()
{
    var rootMenuCtrl = ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader)
    {
        $translatePartialLoader.addPart('MenuRoot');
        // Language switch element
        this.changeLanguage = function (langKey) {
            $translate.use(langKey);
        };
    }];

    return {
        restrict: 'E',
        scope: {},
        controller: rootMenuCtrl,
        controllerAs: 'menu',
        bindToController: true,
        templateUrl: '_templates/_menuRoot.html'
    }
});