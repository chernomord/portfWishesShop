catalogueModule.directive('productCard', function()
{
    var cardCtrl = ['cartContainer', function(cartContainer) {

        var vm = this;

        vm.addItem = function(item) {
            var item4cart = {
                uid: item.uid,
                name: item.name,
                image: item.image,
                description: item.description,
                qty: 1,
                price: item.price,
                categoryID: item.categoryID
            };
            cartContainer.addItem(item4cart);
        }
    }];

    return {
        restrict: 'E',
        scope: {
            product: '='
        },
        controller: cardCtrl,
        controllerAs: 'vm',
        bindToController: true,

        templateUrl: '_templates/_productCard.html'
    }
});