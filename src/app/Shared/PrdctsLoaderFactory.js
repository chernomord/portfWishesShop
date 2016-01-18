funshopApp.factory('productsLoader', ['$http', '$q', function($http, $q){
    var local_storage = [];
    var local_categories = [];
    local_categories = categories;
    return {
        getProducts: function(requests_array) {
            var items = [];
            var request;
            for (var i=0; i<requests_array.length; i++) {
                request = requests_array[i];
                items = window[request];
                for (var n=0; n< items.length; n++) {
                    local_storage.push(items[n]);
                }
            }
            return local_storage;
        },
        getCategories: function() {
            return local_categories;
        },
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