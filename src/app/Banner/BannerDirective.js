bannerModule.directive('mainBanner', ['$timeout', '$q', function($timeout, $q)
{
    var imgsArr = ['img/bg01.jpg','img/bg02.jpg','img/bg03.jpg'];

    return {
        restrict: 'E',
        scope: {},
        templateUrl: '_templates/_banner.html',
        link: function(scope, element, attr, ctrl) {

            // cycle through background images
            // after all imgs preloaded

            scope.imgsDefer = [];

            var img = [],
                imageElm = angular.element(element[0].querySelector('.jumbotron')),
                imN = 1;

            for (var i = 0; i < imgsArr.length; i++) {
                img[i] = new Image();
                img[i].src = (imgsArr[i]);
                img[i].onload = function(event) {
                    scope.imgsDefer.push('done');
                    if (scope.imgsDefer.length == imgsArr.length) cycleBg(1);
                }
            }

            function cycleBg(timeout) {
                $timeout(function () {
                    imN++;
                    imageElm.css({'background-image': 'url('+ imgsArr[imN-1] + ')'});
                    if (imN > 2) imN = 0;
                    cycleBg(10101);
                }, timeout);
            }

        }
    }
}]);