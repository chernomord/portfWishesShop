/**
 * Created by Slava on 09.01.2016.
 */
catalogueModule.directive('productCard', function()
{
    return {
        restrict: 'E',
        scope: {
            product: '='
        },
        templateUrl: '_templates/_productCard.html'
    }
});