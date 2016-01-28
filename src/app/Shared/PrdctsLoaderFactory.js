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