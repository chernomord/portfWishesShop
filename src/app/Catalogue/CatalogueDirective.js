catalogueModule.directive('catalogue', function()
{
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            catID: "@"
        },
        templateUrl: '_templates/_catalogue.html',
        controller: 'ProductsLstCtrl',
        controllerAs: 'vm',
        bindToController: true
    }
});


//
//catalogueModule.directive('catalogue', function()
//{
//    return {
//        restrict: 'E',
//        transclude: true,
//        scope: {
//        },
//        templateUrl: '_templates/_catalogue.html',
//        controller: 'ProductsLstCtrl',
//        controllerAs: 'prods',
//        bindToController: true
//    }
//});