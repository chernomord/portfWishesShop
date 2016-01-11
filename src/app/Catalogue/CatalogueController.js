catalogueModule.controller('GoodiesListController', ['$scope', '$filter', function($scope, $filter) {

    var searchValues = {
        setDefaults: function() {
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

    $scope.goodies = storage;
    $scope.categories = categories;
    $scope.search = searchValues;
    $scope.paginator = {
        currentPage: 1,
        maxSize: 8,
        numPerPage: 9,
        totalItems: null
    };

    // Loads and aggregate full list of tags for tags auto-complete widget
    $scope.loadTags = function(query) {
        // SEPARATE_SERVICE_CANDIDATE AFTER THIS LINE
        var allTagsList = [],
            filteredTags = [];
        for (var i = 0; i<storage.length; i++) {
            allTagsList.push.apply(allTagsList, storage[i].tags);
        }
        allTagsList = unique(allTagsList, 'text');
        for (i = 0; i < allTagsList.length; i++) {
            if (allTagsList[i].text.indexOf(query) !== -1) filteredTags.push(allTagsList[i]);
        }
        return filteredTags;
    };

    // Reset filter on click
    $scope.resetFilter = function() {
        searchValues.setDefaults();
    };

    // Updating filter from inside of the controller
    var updateFilter = function() {
        var results;
        results = $filter('filter')(storage, {name: $scope.search.name, brand: $scope.search.brand});
        results = $filter('byRange')(results, $scope.search.price, 'price');
        results = $filter('byTags')(results, $scope.search.tags, 'tags');
        $scope.paginator.totalItems = results.length;
        return results;
    };

    $scope.$watch('search.name + search.brand + search.price.min + search.price.max + search.tags + paginator.currentPage', function() {
        var filtered = updateFilter();
        var begin = (($scope.paginator.currentPage - 1) * $scope.paginator.numPerPage),
            end = begin + $scope.paginator.numPerPage;
        //console.log(newValues[1]);
        $scope.filteredGoodies = filtered.slice(begin, end);
    }, true);

    $scope.filteredGoodies = updateFilter();

}]);
