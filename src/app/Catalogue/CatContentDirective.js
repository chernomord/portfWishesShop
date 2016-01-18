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
            requests: '=requests'
        },
        require: '^catMenu',
        controller: catContent,
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: '_templates/_catContent.html'
    }
});