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