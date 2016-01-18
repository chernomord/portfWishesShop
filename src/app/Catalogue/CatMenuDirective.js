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