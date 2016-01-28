funshopApp.directive('integerRestrict', function() {
    return {
        restrict: 'A',
        scope: {},
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {

            var pattern = /[^0-9]*/g;

            function fromUser(text) {
                if (!text) {
                    ngModelCtrl.$setViewValue('1');
                    ngModelCtrl.$render();
                    return 1;
                } else {

                    var transformedInput = text.replace(pattern, '');
                    if ((transformedInput !== text)) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    transformedInput = parseInt(transformedInput, 10);
                    return transformedInput;
                }
            }

            ngModelCtrl.$parsers.push(fromUser);
        }
    }
});