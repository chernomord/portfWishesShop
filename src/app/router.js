funshopApp.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/catalogue");
        $stateProvider
            .state('catalogue', {
                url: "/catalogue?category",
                template: "<cat-menu></cat-menu>"
            })
            .state('item', {
                url: "/catalogue/item?category&item",
                templateUrl: "_templates/_itemPage.html",
                controller: 'itemPageCtrl'
            })

            .state('about', {
                url: "/about",
                templateUrl: "_templates/_about.html"
            })
            .state('cart', {
                url: "/cart",
                template: "<cart-list></cart-list>"
            })
            .state('checkOut', {
                url: "/cart/checkout",
                template: "<check-out></check-out>"
            })
            .state('checkOut.confirm', {
                url: "/confirm",
                onEnter: ['$stateParams', '$state', '$uibModal', 'cartContainer', function ($stateParams, $state, $uibModal, cartContainer) {
                    $uibModal.open({
                        templateUrl: "_templates/_checkoutModal.html",
                        controller: 'checkoutConfirmModalCtrl',
                        controllerAs: 'vm',
                        size: 'sm',
                        bindToController: true
                    }).result.then(function () {
                        cartContainer.emptyCart();
                        $state.go('catalogue');
                    }, function(){
                        $state.go('^');
                    });
                }],
                onExit: function() {
                }
            })
    }
]);