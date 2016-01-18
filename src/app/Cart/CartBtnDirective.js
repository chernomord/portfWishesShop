cartModule.directive('cartBtn', function()
{
    var cartBtnCtrl = ['$scope', '$translate', '$translatePartialLoader', 'cartContainer', function($scope, $translate, $translatePartialLoader, cartContainer)
    {
        var vm = this;
        //$translatePartialLoader.addPart('MenuRoot');
        //// Language switch element
        //this.changeLanguage = function (langKey) {
        //    $translate.use(langKey);
        //};
        vm.productsCount = cartContainer.itemCount();
        vm.isDisabled = function() {
            return (vm.productsCount == 0)
        };

        $scope.$watch(
            function() { return cartContainer.itemCount() },
            function() {
                vm.productsCount = cartContainer.itemCount();
            },
            true);
    }];

    return {
        restrict: 'E',
        scope: {},
        controller: cartBtnCtrl,
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: '_templates/_cartBtn.html'
    }
});