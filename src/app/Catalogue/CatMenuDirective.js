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