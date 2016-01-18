checkOutModule.directive('checkOut', function() {
    return {
        restrict: 'E',
        scope: {},
        controller: 'checkOutCtrl',
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: '_templates/_checkOut.html'
    }
});

var checkOutCtrl = function($translate, $translatePartialLoader, productsLoader, cartContainer) {

    var vm = this;

    vm.totalCount = cartContainer.totalPrice();
    vm.cartList = cartContainer.readItems();

};

checkOutCtrl.$inject = ['$translate', '$translatePartialLoader', 'productsLoader', 'cartContainer'];
checkOutModule.controller('checkOutCtrl', checkOutCtrl);