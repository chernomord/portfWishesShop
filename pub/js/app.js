var bannerModule        = angular.module('banner', []),
    catalogueModule     = angular.module('catalogueModule', []),
    menuRootModule      = angular.module('menuRootModule', []),
    cartModule          = angular.module('cartModule', []),
    checkOutModule      = angular.module('checkOutModule', []);

var funshopApp = angular.module('funshopApp', [
    'ngCookies',
    'ui.router',
    'ui.bootstrap',
    'pascalprecht.translate',
    //'ngSanitize',
    'ngTagsInput',
    'catalogueModule',
    'banner',
    'menuRootModule',
    'cartModule',
    'checkOutModule'
]);


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
funshopApp.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/catalogue");
        $stateProvider
            .state('catalogue', {
                url: "/catalogue",
                template: "<cat-menu><cat-content></cat-content></cat-menu>"
            })
            .state('catalogue.item', {
                url: "/item",
                template: "<p>item</p>"
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
bannerModule.directive('mainBanner', function()
{
    return {
        restrict: 'E',
        scope: {},
        templateUrl: '_templates/_banner.html'
    }

});
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
var ProductsLstCtrl = function($scope, $filter, productsLoader, $location) {

    var vm = this;

    vm.catID = $location.search()['category'];
    console.log(vm.catID);
    this.$filter = $filter;
    this.$scope = $scope;
    this.productsLoader = productsLoader;

    var searchValues = {
        setDefaults: function () {
            this.name = '';
            this.brand = '';
            this.price = {
                min: null,
                max: null
            };
            this.tags = null;
        }
    };
    searchValues.setDefaults();

    productsLoader.getJSONProducts(['abstract.json', 'material.json']).then(function(results) {
        vm.goodies = results;
        vm.search = Object.create(searchValues);
        vm.categories = productsLoader.getCategories();
        vm.paginator = {
            currentPage: 1,
            maxSize: 8,
            numPerPage: 9,
            totalItems: vm.goodies.length
        };

        vm.updateProds();

        $scope.$watch(
            function watchAll() {
                return [vm.search.tags, vm.search.price.min, vm.search.price.max, vm.search.name, vm.search.brand];
            },
            function() {
                if (vm.search.price.min < 0) vm.search.price.min = 0;
                if (vm.search.price.max < 0) vm.search.price.max = 0;
                vm.updateProds();
            }, true);
    });
};

// Loads and aggregate full list of tags for tags auto-complete widget
ProductsLstCtrl.prototype.loadTags = function(query) {
    var allTagsList = [],
        filteredTags = [];
    for (var i = 0; i<this.goodies.length; i++) {
        allTagsList.push.apply(allTagsList, this.goodies[i].tags);
    }
    allTagsList = unique(allTagsList, 'text');
    for (i = 0; i < allTagsList.length; i++) {
        if (allTagsList[i].text.indexOf(query) !== -1) filteredTags.push(allTagsList[i]);
    }
    return filteredTags;
};

/*
* Reset filter on click
*/
ProductsLstCtrl.prototype.resetFilter = function() {
    this.search.setDefaults();
};

/*
* Updating filter from inside of the controller
* TODO: Move the function into separate service for the sake of sleek controller code
*/
ProductsLstCtrl.prototype.updateFilter = function(products, search, pgn) {
    var results;
    results = this.$filter('filter')(products, {name: search.name, brand: search.brand});
    results = this.$filter('byRange')(results, search.price, 'price');
    results = this.$filter('byTags')(results, search.tags, 'tags');
    pgn.totalItems = results.length;
    var begin = ((pgn.currentPage - 1) * pgn.numPerPage),
        end = begin + pgn.numPerPage;
    results = results.slice(begin, end);
    return results;
};

// update filtered products on model change
ProductsLstCtrl.prototype.updateProds = function() {
    this.filteredGoodies = this.updateFilter(this.goodies, this.search, this.paginator);
};

ProductsLstCtrl.$inject = ['$scope', '$filter', 'productsLoader', '$location'];

catalogueModule.controller('ProductsLstCtrl', ProductsLstCtrl);
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
catalogueModule.filter('byRange', function() {
    return function(input, rangeObj, prop) {
        var results = [];
        // when both not defined or null
        if (rangeObj === undefined || rangeObj == null || (rangeObj.min === null && rangeObj.max === null)) return input;
        // when .min undef
        else if (rangeObj.min === undefined || rangeObj.min === null) {
            if (rangeObj.max == 0) return input;
            for (var i = 0; i < input.length; i++) {
                if (input[i][prop] <= rangeObj.max) results.push(input[i]);
            }
            return results;
        }
        // when .max undef or zero
        else if (rangeObj.max === undefined || rangeObj.max === null || rangeObj.max == 0) {
            for (i = 0; i < input.length; i++) {
                if (input[i][prop] >= rangeObj.min) results.push(input[i]);
            }
            return results;
        }
        // when min and max defined
        else {
            for (i = 0; i < input.length; i++) {
                if (input[i][prop] >= rangeObj.min && input[i][prop] <= rangeObj.max) {
                    results.push(input[i]);
                }
            }
            return results;
        }
    }
});

catalogueModule.filter('byTags', function() {
    return function(input, tagsArray, prop) {
        var matchedResults = [];
        if (!tagsArray) return input;
        else {
            for (var i = 0; i < input.length; i++) {
                var matched = 0;
                for (var t = 0; t < tagsArray.length; t++) {
                    for (var p = 0; p < input[i][prop].length; p++) {
                        if (input[i][prop][p].text == tagsArray[t].text) matched++;
                    }
                }
                if (matched == tagsArray.length) matchedResults.push(input[i]);
            }
            return matchedResults;
        }
    }
});

catalogueModule.filter('myUnique', function() {
    return function(input, prop) {

        if (!input || !prop) {return false}

        var filtered = unique(input, prop);

        var results = [];
        for (var i = 0; i < filtered.length; i++) {
            results.push(filtered[i]);
        }
        return results;
    }
});

catalogueModule.directive('catContent', function()
{
    var catContent = ['productsLoader', '$scope', '$filter', function(productsLoader, $scope, $filter) {

        var vm = this;

        //vm.catID = $scope.catId;

        var searchValues = {
            setDefaults: function () {
                this.name = '';
                this.brand = '';
                this.price = {
                    min: null,
                    max: null
                };
                this.tags = null;
            }
        };
        searchValues.setDefaults();

        $scope.$watch(function(){return vm.requests}, function () {

            if(vm.requests) {

                productsLoader.getJSONProducts(vm.requests).then(function(results) {
                    vm.goodies = results;
                    vm.search = Object.create(searchValues);
                    //vm.categories = vm.categories;
                    vm.paginator = {
                        currentPage: 1,
                        maxSize: 8,
                        numPerPage: 9,
                        totalItems: vm.goodies.length
                    };

                    vm.updateProds();

                    $scope.$watch(
                        function watchAll() {
                            return [vm.search.tags, vm.search.price.min, vm.search.price.max, vm.search.name, vm.search.brand];
                        },
                        function() {
                            if (vm.search.price.min < 0) vm.search.price.min = 0;
                            if (vm.search.price.max < 0) vm.search.price.max = 0;
                            vm.updateProds();
                        }, true);
                });
            }

        },true);

// Loads and aggregate full list of tags for tags auto-complete widget
        vm.loadTags = function(query) {
            var allTagsList = [],
                filteredTags = [];
            for (var i = 0; i<this.goodies.length; i++) {
                allTagsList.push.apply(allTagsList, this.goodies[i].tags);
            }
            allTagsList = unique(allTagsList, 'text');
            for (i = 0; i < allTagsList.length; i++) {
                if (allTagsList[i].text.indexOf(query) !== -1) filteredTags.push(allTagsList[i]);
            }
            return filteredTags;
        };

        /*
         * Reset filter on click
         */
        vm.resetFilter = function() {
            vm.search.setDefaults();
        };

        /*
         * Updating filter from inside of the controller
         */
        vm.updateFilter = function(products, search, pgn) {
            var results;
            results = $filter('filter')(products, {name: search.name, brand: search.brand});
            results = $filter('byRange')(results, search.price, 'price');
            results = $filter('byTags')(results, search.tags, 'tags');
            pgn.totalItems = results.length;
            var begin = ((pgn.currentPage - 1) * pgn.numPerPage),
                end = begin + pgn.numPerPage;
            results = results.slice(begin, end);
            return results;
        };

// update filtered products on model change
        vm.updateProds = function() {
            vm.filteredGoodies = vm.updateFilter(vm.goodies, vm.search, vm.paginator);
        };

    }];

    return {
        restrict: 'E',
        scope: {
            requests: '=requests',
            categories: '=categories'
        },
        require: '^catMenu',
        controller: catContent,
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: '_templates/_catContent.html'
    }
});
catalogueModule.directive('catMenu', ['$timeout', '$location', function($timeout,$location) {

    var location = $location.search();
    var catID= 'all';


    var catMenuCtrl = ['$q','cartContainer','productsLoader', '$scope', function($q, cartContainer, productsLoader, $scope) {

        var vm = this;

        $scope.catID = catID;

        productsLoader.getJSONCategories().then(function(results){
            vm.categories = results;
            $scope.setRequests = function (catID) {
                var requests = [];
                for (var i =0; i < results.length; i++) {
                    if (results[i].id == catID || catID=="all") {
                        requests.push(results[i].http_request);
                    }
                }
                return requests;
            }
        });

        vm.categorySet = function (newcatID) {
            $scope.catID = newcatID;
            $scope.requests = $scope.setRequests(newcatID);
        };


    }];

    var linkFn = function(scope, element, attrs) {

        element.find('ul').on('click', function (event)  {
            var elem = angular.element(event.target);
            var cat_id = elem.attr('data-cat-id');
            scope.$apply(function(){
                $location.search('category',cat_id);
            });
            elem.parent().parent().children().removeClass('active');
            elem.parent().addClass('active');

        });

        scope.$watch('vm.categories', function(newValue,oldValue){
            if (newValue){

                var link = element.find('a');
                $timeout(function(){
                    if (location.category && (location.category < link.length)) {
                        catID = location.category;
                        scope.catID = location.category;
                        scope.requests = scope.setRequests(catID);
                    }
                    else {
                        catID = "all";
                        scope.catID ='all';
                        scope.requests = scope.setRequests(catID);
                    }
                    for (var i=0; i<link.length; i++) {
                        var elem = angular.element(link[i]);
                        if (link.eq(i).attr('data-cat-id') == catID) {
                            scope.$apply(function(){
                                $location.search('category',elem.attr('data-cat-id'));
                            });
                            link.eq(i).parent().addClass('active');
                        }
                    }
                });

                //link.on('click', function(event){
                //    var elem = angular.element(this);
                //    var cat_id = elem.attr('data-cat-id');
                //    scope.$apply(function(){
                //        $location.search('category',cat_id);
                //    });
                //    elem.parent().parent().children().removeClass('active');
                //    elem.parent().addClass('active');
                //});
            }
        });
    };

    return {
        transclude: true,
        restrict: 'E',
        scope: {},
        controller: catMenuCtrl,
        controllerAs: 'vm',
        bindToController: true,
        link: linkFn,
        templateUrl: '_templates/_catMenu.html'
    }
}]);
catalogueModule.directive('productCard', function()
{
    var cardCtrl = ['cartContainer', function(cartContainer) {

        var vm = this;

        vm.addItem = function(item) {
            var item4cart = {
                uid: item.uid,
                name: item.name,
                description: item.description,
                qty: 1,
                price: item.price
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
checkOutModule.controller('checkoutConfirmModalCtrl', ['$uibModalInstance', function ($uibModalInstance) {

    var vm = this;

    vm.ok = function () {
        $uibModalInstance.close('success');
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);
/**
 * Created by Slava on 11.01.2016.
 */

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
funshopApp.factory('cartContainer', ['$cookies', function($cookies){
    var _cartItemProto = {
        uid : '',
        qty     : '',
        price   : '',
        name : '',
        description: '',
        image: ''
    };
    var cartContainer = [];
    if ($cookies.get('localCart')) {
        cartContainer = $cookies.getObject('localCart');
    }

    var cart = {
        items: cartContainer,
        totalItems: function () {
            var totalCount = 0;
            for (var i=0; i < this.items.length; i++) {
                totalCount += parseInt((this.items[i].qty), 10);
            }
            return totalCount
        },
        totalPrice: function() {
            var totalPrice = 0;
            for (var i = 0; i < this.items.length; i++ ) {
                totalPrice += (this.items[i].qty * this.items[i].price);
            }
            return totalPrice
        },
        addItem: function(newItem) {
            var found = false;
            for (var i=0; i < this.items.length; i++) {
                if (this.items[i].uid == newItem.uid) {
                    this.items[i].qty += newItem.qty;
                    found = true;
                }
            }
            if (!found) {
                newItem.qty = 1;
                this.items.push(newItem);
            }
        },
        minusItem: function(itemUID) {
            for (var i=0; i < this.items.length; i++) {
                if (this.items[i].uid == itemUID) {
                    var qty = this.items[i].qty;
                    this.items[i].qty = qty - 1;
                    if (this.items[i].qty < 1 ) {
                        this.items.splice(i,1)
                    }
                }
            }
        },
        plusItem: function(itemUID) {
            for (var i=0; i < this.items.length; i++) {
                if (this.items[i].uid == itemUID) {
                    var qty = this.items[i].qty;
                    this.items[i].qty++;
                }
            }
        },
        removeItemType: function(itemUID) {
            for (var i=0; i < this.items.length; i++) {
                if (this.items[i].uid == itemUID) {
                    this.items.splice(i,1);
                }
            }
        }
    };

    return {
        addItem: function(newItem) {
            cart.addItem(newItem);
            $cookies.putObject('localCart', cart.items);
        },
        minusItem: function(itemUID) {
            cart.minusItem(itemUID);
            $cookies.putObject('localCart', cart.items);
        },
        plusItem: function(itemUID){
            cart.plusItem(itemUID);
            $cookies.putObject('localCart', cart.items);
        },
        readItems: function() {
            return cart.items
        },
        itemCount: function() {
            return cart.totalItems();
        },
        totalPrice: function() {
            return cart.totalPrice();
        },
        emptyCart: function() {
            cart.items = [];
            $cookies.remove('localCart');
        },
        removeItemType: function(itemUID) {
            cart.removeItemType(itemUID);
            $cookies.putObject('localCart', cart.items);
        }
    };
}]);
/**
 * Created by Slava on 21.11.2015.
 */
//function uniq(a) {
//    var seen = {};
//    return a.filter(function(item) {
//        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
//    });
//}

//
function unique(input, prop){
    // first - clone the input to stay on the safe side
    var c = input.slice(0);
    c.sort(function (a,b){
        //if a numbers in input
        //if (a[prop] > b[prop]) return 1;
        //if (a[prop] < b[prop]) return -1;
        //if string in input
        return a[prop].localeCompare(b[prop]);
    });
    for(var i = 1; i < c.length; ){
        if(c[i-1][prop] == c[i][prop]){
            c.splice(i, 1);
        } else {
            i++;
        }
    }
    return c;
}
funshopApp.factory('productsLoader', ['$http', '$q', function($http, $q){
    var local_storage = [];
    var local_categories = [];
    //local_categories = categories;
    return {
        //getProducts: function(requests_array) {
        //    var items = [];
        //    var request;
        //    for (var i=0; i<requests_array.length; i++) {
        //        request = requests_array[i];
        //        items = window[request];
        //        for (var n=0; n< items.length; n++) {
        //            local_storage.push(items[n]);
        //        }
        //    }
        //    return local_storage;
        //},
        //getCategories: function() {
        //    return local_categories;
        //},
        getJSONProducts: function(requests_array) {
            var items = [];
            var requests = [];
            var defer = $q.defer();
            for (var i=0; i<requests_array.length; i++) {
                requests[i] = $http.get("data/" + requests_array[i], [cache=true]);
            }
            $q.all(requests).then(function(results_array) {
                for (var n=0; n< results_array.length; n++) {
                    for (var d=0; d < results_array[n].data.length; d++) {
                        items.push(results_array[n].data[d]);
                    }
                }
                defer.resolve(items);
            }, function (error) {
                defer.reject(error);
            }, function (update) {
                defer.update(update);
            });
            return defer.promise;
        },
        getJSONCategories: function() {
            var defer = $q.defer();
            $http.get("data/categories.json", [cache=true]).then(function(results){
                defer.resolve(results.data);
            }, function (error) {
                defer.reject(error);
            }, function (update) {
                defer.update(update);
            });
            return defer.promise;
        }
    }
}]);