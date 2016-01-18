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