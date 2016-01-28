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