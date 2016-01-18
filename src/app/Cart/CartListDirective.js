cartModule.directive('cartList', function() {
    return {
        restrict: 'E',
        scope: {},
        controller: 'cartListCtrl',
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: '_templates/_cartList.html'
    }
});

var cartListCtrl = function($state, $translate, $translatePartialLoader, productsLoader, cartContainer) {

    var vm = this;

    vm.totalCount = cartContainer.totalPrice();
    vm.cartList = cartContainer.readItems();
    vm.removeItemType = function(item_uid) {
        cartContainer.removeItemType(item_uid);
        vm.updateCartModel();
    };
    vm.minusItem = function(item_uid) {
        cartContainer.minusItem(item_uid);
        vm.updateCartModel();
    };
    vm.plusItem = function(item_uid) {
        cartContainer.plusItem(item_uid);
        vm.updateCartModel();
    };
    vm.emptyCart = function() {
        cartContainer.emptyCart();
        vm.updateCartModel();
        $state.go('catalogue');
    };

    vm.updateCartModel = function() {
        vm.totalCount = cartContainer.totalPrice();
        vm.cartList = cartContainer.readItems();
        if (vm.totalCount < 1) {
            $state.go('catalogue');
        }
    };

};

cartListCtrl.$inject = ['$state', '$translate', '$translatePartialLoader', 'productsLoader', 'cartContainer'];
cartModule.controller('cartListCtrl', cartListCtrl);