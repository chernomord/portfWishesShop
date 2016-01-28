cartModule.directive('cartBtn', ['$timeout', function($timeout)
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
        templateUrl: '_templates/_cartBtn.html',
        link: function(scope, element, attr, ctrl) {
            var btnEl = element.find('button'),
                badge = angular.element(element[0].querySelector('.badge')),
                timer = null,
                defColor = btnEl.css('background-color'),
                plusColor = '#5CBA5F',
                minusColor = '#F4A82B';

            var modelChanged = function (newVal, oldVal) {

                if(timer){
                    $timeout.cancel(timer);
                    timer = null;
                }

                if (newVal > oldVal) {
                    btnEl.css({'background-color': plusColor, 'border-color': plusColor});
                    badge.css({'color': plusColor});
                } else {
                    btnEl.css({'background-color': minusColor, 'border-color': minusColor});
                    badge.css({'color': minusColor});
                }

                timer = $timeout(function() {
                    btnEl.css({'background-color':defColor,'border-color':defColor});
                    badge.css({'color': defColor});
                }, 200);

            };

            scope.$watch(function(){ return scope.vm.productsCount; }, modelChanged);
        }
    }
}]);