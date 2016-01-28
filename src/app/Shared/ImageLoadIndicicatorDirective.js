funshopApp.directive('imageLoadIndicator', function() {
    return {
        restrict: 'E',
        scope: {
            src: '=imgSrc',
            width: '='
        },
        template:
        '<div class="img-loading-container">' +
        '<div class="content-container">' +
        '<div class="spinner"></div>' +
        '<img ng-src="{{src}}" width="{{width}}' + '%" height="auto">' +
        '</div></div>',


        link: function(scope, element) {
            element.find('img').on('load', function() {
                element.children().addClass('loaded');
            });
            //scope.$watch('src', function() {
            //    element.children().removeClass('loaded');
            //}, true);
        }
    };
});