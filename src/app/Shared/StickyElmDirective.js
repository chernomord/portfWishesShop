funshopApp.directive('stickyElm', ['$window', function($window){

    var linkFn = function(scope, element, attrs) {

        // Sticky scroll
        /*
        * Avialable parameters:
        * #params.offset = integer
        * #params.center = boolean
        * #params.zIndex = integer
        * passed as json object
        */
        var offset = 0,
            center = true,
            zIndex = 10,
            windowEl = angular.element($window),
            initYOffset = element[0].getBoundingClientRect().top,
            left, right;

        if (!((scope.params == 'sticky-elm') || (scope.params == 'data-sticky-elm')))
        {
            var params = JSON.parse(scope.params);
            offset = parseInt(params.offset, 10);
            center = (params.center == 'true');
            zIndex = params.zIndex;
        }
        element.initHeight = element[0].offsetHeight + parseInt(window.getComputedStyle(element[0]).marginBottom, 10);

        if (center) {
            left = 0; right = 0;
        } else {
            left = 'auto'; right = 'auto';
        }

        var handler = function ()
        {
            if ( (initYOffset <= ($window.pageYOffset + offset)) && initYOffset >= 0 ) {
                element.css({'position': 'fixed', 'top': offset +'px', 'left': left, 'right': right, 'z-index': zIndex});
                (offset == 0) ? element.parent().parent().css('padding-top', element.initHeight + 'px') : element.parent().css('padding-top', element.initHeight + 'px');
            } else {
                element.css({'position': 'relative', 'top': '0'});
                (offset == 0) ? element.parent().parent().css('padding-top', '0') : element.parent().css('padding-top', '0');
            }
        };

        windowEl.on('scroll', scope.$apply.bind(scope, handler));

        handler();

    };

    return {
        restrict: 'A',
        scope: {
            params: "@stickyElm"
        },
        link: linkFn
    }

}]);