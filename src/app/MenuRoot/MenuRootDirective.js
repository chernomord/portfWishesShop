menuRootModule.directive('menuRoot', function()
{

    var controller = ['$scope', '$translate', '$translatePartialLoader', function($scope, $translate, $translatePartialLoader)
    {
        $translatePartialLoader.addPart('MenuRoot');

        // Language switch element
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
        };


    }];

    return {
        restrict: 'E',
        scope: {},
        controller: controller,
        templateUrl: '_templates/_menuRoot.html'
    }

});