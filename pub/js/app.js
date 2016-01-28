var bannerModule        = angular.module('bannerModule', []),
    catalogueModule     = angular.module('catalogueModule', []),
    itemModule          = angular.module('itemModule', []),
    menuRootModule      = angular.module('menuRootModule', []),
    cartModule          = angular.module('cartModule', []),
    checkOutModule      = angular.module('checkOutModule', []);

var funshopApp = angular.module('funshopApp', [
    'ngAnimate',
    'ngCookies',
    'ui.router',
    'ui.bootstrap',
    'pascalprecht.translate',
    //'ngSanitize',
    'ngTagsInput',
    'catalogueModule',
    'bannerModule',
    'menuRootModule',
    'cartModule',
    'checkOutModule',
    'itemModule'
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
bannerModule.directive('mainBanner', ['$timeout', '$q', function($timeout, $q)
{
    var imgsArr = ['img/bg01.jpg','img/bg02.jpg','img/bg03.jpg'];

    return {
        restrict: 'E',
        scope: {},
        templateUrl: '_templates/_banner.html',
        link: function(scope, element, attr, ctrl) {

            // cycle through background images
            // after all imgs preloaded

            scope.imgsDefer = [];

            var img = [],
                imageElm = angular.element(element[0].querySelector('.jumbotron')),
                imN = 1;

            for (var i = 0; i < imgsArr.length; i++) {
                img[i] = new Image();
                img[i].src = (imgsArr[i]);
                img[i].onload = function(event) {
                    scope.imgsDefer.push('done');
                    if (scope.imgsDefer.length == imgsArr.length) cycleBg(1);
                }
            }

            function cycleBg(timeout) {
                $timeout(function () {
                    imN++;
                    imageElm.css({'background-image': 'url('+ imgsArr[imN-1] + ')'});
                    if (imN > 2) imN = 0;
                    cycleBg(10101);
                }, timeout);
            }

        }
    }
}]);
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

        vm.loadFinished = false;

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
        vm.search = Object.create(searchValues);


        $scope.$watch(function(){return vm.requests}, function () {

            if(vm.requests) {
                vm.loadFinished = false;

                productsLoader.getJSONProducts(vm.requests).then(function(results) {
                    vm.goodies = results;

                    //vm.categories = vm.categories;
                    vm.paginator = {
                        currentPage: 1,
                        maxSize: 8,
                        numPerPage: 9,
                        totalItems: vm.goodies.length
                    };

                    vm.updateProds();
                    vm.loadFinished = true;

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

        vm.setOrder = function(param) {

            (param == 'alph') ? $scope.priceReverse = null : $scope.alphReverse = null;
            vm.updateProds();
        };

        /*
         * Updating filter from inside of the controller
         */
        vm.updateFilter = function(products, search, pgn) {
            var results;
            results = $filter('filter')(products, {name: search.name, brand: search.brand});
            results = $filter('byRange')(results, search.price, 'price');
            results = $filter('byTags')(results, search.tags, 'tags');
            if ($scope.alphReverse || ($scope.alphReverse == false)) {
                results = $filter('orderBy')(results, 'name', $scope.alphReverse);
            }
            if ($scope.priceReverse || ($scope.priceReverse == false)) {
                results = $filter('orderBy')(results, 'price',$scope.priceReverse);
            }
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
catalogueModule.directive('catMenu', ['$window', function($window) {

    var catMenuCtrl = ['cartContainer','productsLoader','$scope','$state','$stateParams',
        function(cartContainer,productsLoader,$scope,$state,$stateParams) {

        var vm = $scope;

        if ($stateParams.category) {
            vm.catID = $stateParams.category;
        } else {
            vm.catID = 'all';
        }

        productsLoader.getJSONCategories().then(function(results){
            vm.categories = results;

            vm.requests = [];
            for (var i =0; i < results.length; i++) {
                if (results[i].id == vm.catID || vm.catID=="all") {
                    vm.requests.push(results[i].http_request);
                }
            }
            vm.categorySet = function (newcatID) {
                vm.catID = newcatID;
                $state.go('catalogue', { category: newcatID });
            };
        });
    }];

    return {
        transclude: true,
        restrict: 'E',
        scope: {},
        controller: catMenuCtrl,
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
cartModule.directive('cartListConfirm', ['$document', function($document) {
    return {
        restrict: 'A',
        require: '?ngModel',
        transclude: true,
        template: '<div ng-transclude></div>',
        //scope: {
        //},
        link: function (scope, element, attr, ctrl) {
            scope.confirmShow = false;
            //element.find('button').bind('click', function(){
            //    scope.confirmShow = !scope.confirmShow;
            //    console.log(scope.confirmShow);
            //});
            scope.toggleSelect = function(){
                scope.confirmShow = !scope.confirmShow;
            };
            $document.bind('click', function(event){
                var isClickedElementChildOfPopup = angular
                        .element(element[0].contains(event.target))
                        .length > 0;

                if (isClickedElementChildOfPopup)
                    return;

                scope.$apply(function(){
                    scope.confirmShow = false;
                });
            });

        }
    }
}]);
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
var itemPageCtrl = function($state, $translate, $translatePartialLoader, productsLoader, $stateParams, $scope, cartContainer) {

    var currentCategoryID = $stateParams.category;
    var currentItemID = $stateParams.item;

    var vm = $scope;

    $scope.maxQty = [1,2,3,4,5];

    productsLoader.getJSONCategories().then(function(categories){
        var request= [];
        var categoryName;
        for (var i =0; i < categories.length; i++) {
            if (categories[i].id == currentCategoryID) {
                request = categories[i].http_request;
                categoryName = categories[i].name;
            }
        }
        if ( !request ) { $state.go('catalogue'); }

        productsLoader.getJSONProducts(request).then(function(items) {
            for (var n =0; n < items.length; n++) {
                if (items[n].uid == currentItemID) { $scope.item = items[n]; }
            }
            if (!$scope.item) { $state.go('catalogue'); }

            $scope.item.categoryName =  categoryName;
            $scope.item.qty = 1;

        })
    });

    $scope.addItem = function(item) {
        var item4cart = {
            uid: item.uid,
            name: item.name,
            image: item.image,
            description: item.description,
            qty: item.qty,
            price: item.price,
            categoryID: item.categoryID
        };
        cartContainer.addItem(item4cart);
    };

};

itemPageCtrl.$inject = ['$state', '$translate', '$translatePartialLoader', 'productsLoader', '$stateParams', '$scope', 'cartContainer'];
itemModule.controller('itemPageCtrl', itemPageCtrl);
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
                if (!newItem.qty) { newItem.qty = 1; }
                newItem.description = newItem.description.slice(0,51);
                this.items.push(newItem);
            }
        },
        minusItem: function(itemUID) {
            for (var i=0; i < this.items.length; i++) {
                if (this.items[i].uid == itemUID) {
                    var qty = this.items[i].qty;
                    this.items[i].qty = qty - 1;
                    if (this.items[i].qty < 1 ) {
                        this.items[i].qty = 1;
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
funshopApp.directive('imageLoadIndicator', function() {
    return {
        restrict: 'E',
        scope: {
            src: '=imgSrc',
            width: '='
        },
        template:
        '<div class="img-loading-container">' +
        '<div class="content-container">' +
        '<div class="spinner"></div>' +
        '<img ng-src="{{src}}" width="{{width}}' + '%" height="auto">' +
        '</div></div>',


        link: function(scope, element) {
            element.find('img').on('load', function() {
                element.children().addClass('loaded');
            });
            //scope.$watch('src', function() {
            //    element.children().removeClass('loaded');
            //}, true);
        }
    };
});
funshopApp.directive('integerRestrict', function() {
    return {
        restrict: 'A',
        scope: {},
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {

            var pattern = /[^0-9]*/g;

            function fromUser(text) {
                if (!text) {
                    ngModelCtrl.$setViewValue('1');
                    ngModelCtrl.$render();
                    return 1;
                } else {

                    var transformedInput = text.replace(pattern, '');
                    if ((transformedInput !== text)) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    transformedInput = parseInt(transformedInput, 10);
                    return transformedInput;
                }
            }

            ngModelCtrl.$parsers.push(fromUser);
        }
    }
});
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
    var local_categories;
    return {
        getJSONProducts: function(requests_array) {
            var items = [];
            var requests = [];
            var defer = $q.defer();

            // transform #requests depending on type then form http calls array
            if( Object.prototype.toString.call( requests_array ) === '[object Array]' ) {
                for (var i=0; i<requests_array.length; i++) {
                    requests[i] = $http.get("data/" + requests_array[i], [cache=true]);
                }
            } else { requests.push($http.get("data/" + requests_array, [cache=true]))}

            // send batch http request for data
            $q.all(requests).then(function(results_array) {
                for (var n=0; n< results_array.length; n++) {
                    for (var d=0; d < results_array[n].data.length; d++) {
                        results_array[n].data[d].price = parseInt(results_array[n].data[d].price, 10);
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
            if (!local_categories) {
                $http.get("data/categories.json", [cache = true]).then(function (results) {
                    local_categories = results.data;
                    defer.resolve(local_categories);
                }, function (error) {
                    defer.reject(error);
                }, function (update) {
                    defer.update(update);
                });
                return defer.promise;
            } else {
                defer.resolve(local_categories);
                return defer.promise;
            }
        }
    }
}]);
funshopApp.directive('stickyElm', ['$window', function($window){

    var linkFn = function(scope, element, attrs) {

        // Sticky scroll
        /*
        * Avialable parameters:
        * #params.offset = integer
        * #params.center = boolean
        * #params.zIndex = integer
        * passed as json object
        */
        var offset = 0,
            center = true,
            zIndex = 10,
            windowEl = angular.element($window),
            initYOffset = element[0].getBoundingClientRect().top,
            left, right;

        if (!((scope.params == 'sticky-elm') || (scope.params == 'data-sticky-elm')))
        {
            var params = JSON.parse(scope.params);
            offset = parseInt(params.offset, 10);
            center = (params.center == 'true');
            zIndex = params.zIndex;
        }
        element.initHeight = element[0].offsetHeight + parseInt(window.getComputedStyle(element[0]).marginBottom, 10);

        if (center) {
            left = 0; right = 0;
        } else {
            left = 'auto'; right = 'auto';
        }

        var handler = function ()
        {
            if ( (initYOffset <= ($window.pageYOffset + offset)) && initYOffset >= 0 ) {
                element.css({'position': 'fixed', 'top': offset +'px', 'left': left, 'right': right, 'z-index': zIndex});
                (offset == 0) ? element.parent().parent().css('padding-top', element.initHeight + 'px') : element.parent().css('padding-top', element.initHeight + 'px');
            } else {
                element.css({'position': 'relative', 'top': '0'});
                (offset == 0) ? element.parent().parent().css('padding-top', '0') : element.parent().css('padding-top', '0');
            }
        };

        windowEl.on('scroll', scope.$apply.bind(scope, handler));

        handler();

    };

    return {
        restrict: 'A',
        scope: {
            params: "@stickyElm"
        },
        link: linkFn
    }

}]);