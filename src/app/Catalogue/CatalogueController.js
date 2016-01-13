var ProductsLstCtrl = function($scope, $filter) {

    var vm = this;

    this.$filter = $filter;
    this.$scope = $scope;

    this._searchValues = {
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
    this._searchValues.setDefaults();

    this.objPropsFor = function(prop) {
        return {
            get: function () {
                return this._searchValues[prop];
            }.bind(this),
            set: function (newValue) {
                this._searchValues[prop] = newValue;
                this.updateProds();
            }.bind(this),
            enumerable: true,
            configurable: true
        }
    };
    this.search = Object.create(this._searchValues, {
        "name":     this.objPropsFor('name'),
        "brand":    this.objPropsFor('brand')
    });
    this.goodies = storage;
    this.categories = categories;
    this.paginator = {
        currentPage: 1,
        maxSize: 8,
        numPerPage: 9,
        totalItems: storage.length
    };

    this.updateProds();

    $scope.$watch(
    function watchAll() {
        return [vm.search.tags, vm.search.price.min, vm.search.price.max];
    },
    vm.updateProds(), true);
};

// Loads and aggregate full list of tags for tags auto-complete widget
ProductsLstCtrl.prototype.loadTags = function(query) {
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
ProductsLstCtrl.prototype.resetFilter = function() {
    this.search.setDefaults();
};

// Updating filter from inside of the controller
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
    this.filteredGoodies = this.updateFilter(storage, this.search, this.paginator);
};

ProductsLstCtrl.$inject = ['$scope', '$filter'];

catalogueModule.controller('ProductsLstCtrl', ProductsLstCtrl);