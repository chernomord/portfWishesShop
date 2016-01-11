/**
 * Created by Slava on 19.11.2015.
 */

var bannerModule = angular.module('banner', []);
var catalogueModule = angular.module('catalogueModule', []);
var menuRootModule = angular.module('menuRootModule', []);

var funshopApp = angular.module('funshopApp', [
    'ngCookies',
    'ui.router',
    'ui.bootstrap',
    'pascalprecht.translate',
    //'ngSanitize',
    'ngTagsInput',
    'catalogueModule',
    'banner',
    'menuRootModule'
]);

funshopApp.config([
    '$translateProvider',
    '$translatePartialLoaderProvider',
    function ($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider
        //.uniformLanguageTag('bcp47')
        .registerAvailableLanguageKeys(['en', 'ru'], {
            'en_*': 'en',
            'ru_*': 'ru'
        })
        .determinePreferredLanguage()
        .fallbackLanguage('en')
        .useCookieStorage()
        .useLoader('$translatePartialLoader', {
            urlTemplate: 'i18n/{part}/{lang}.json'
        })
        .useLoaderCache(true)
        .useSanitizeValueStrategy('escape');
    $translatePartialLoaderProvider.addPart('Banner', 'MenuRoot', 'Catalogue');
}]);

funshopApp.run(function ($rootScope, $translate) {
    $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
        $translate.refresh();
    });
});
bannerModule.directive('mainBanner', function()
{
    return {
        restrict: 'E',
        scope: {},
        templateUrl: '_templates/_banner.html'
    }

});
catalogueModule.controller('GoodiesListController', ['$scope', '$filter', function($scope, $filter) {

    var searchValues = {
        setDefaults: function() {
            this.name = '';
            this.brand = '';
            this.price = {
                min: null,
                max: null
            };
            this.tags = null;
        }
    };
    searchValues.setDefaults();

    $scope.goodies = storage;
    $scope.categories = categories;
    $scope.search = searchValues;
    $scope.paginator = {
        currentPage: 1,
        maxSize: 8,
        numPerPage: 9,
        totalItems: null
    };

    // Loads and aggregate full list of tags for tags auto-complete widget
    $scope.loadTags = function(query) {
        // SEPARATE_SERVICE_CANDIDATE AFTER THIS LINE
        var allTagsList = [],
            filteredTags = [];
        for (var i = 0; i<storage.length; i++) {
            allTagsList.push.apply(allTagsList, storage[i].tags);
        }
        allTagsList = unique(allTagsList, 'text');
        for (i = 0; i < allTagsList.length; i++) {
            if (allTagsList[i].text.indexOf(query) !== -1) filteredTags.push(allTagsList[i]);
        }
        return filteredTags;
    };

    // Reset filter on click
    $scope.resetFilter = function() {
        searchValues.setDefaults();
    };

    // Updating filter from inside of the controller
    var updateFilter = function() {
        var results;
        results = $filter('filter')(storage, {name: $scope.search.name, brand: $scope.search.brand});
        results = $filter('byRange')(results, $scope.search.price, 'price');
        results = $filter('byTags')(results, $scope.search.tags, 'tags');
        $scope.paginator.totalItems = results.length;
        return results;
    };

    $scope.$watch('search.name + search.brand + search.price.min + search.price.max + search.tags + paginator.currentPage', function() {
        var filtered = updateFilter();
        var begin = (($scope.paginator.currentPage - 1) * $scope.paginator.numPerPage),
            end = begin + $scope.paginator.numPerPage;
        //console.log(newValues[1]);
        $scope.filteredGoodies = filtered.slice(begin, end);
    }, true);

    $scope.filteredGoodies = updateFilter();

}]);

/**
 * Created by Slava on 21.11.2015.
 */

catalogueModule.filter('byRange', function() {
    return function(input, rangeObj, prop) {
        var results = [];
        // when both not defined or null
        if (rangeObj === undefined || rangeObj == null || (rangeObj.min === null && rangeObj.max === null)) return input;
        // when .min undef
        else if (rangeObj.min === undefined || rangeObj.min === null) {
            for (var i = 0; i < input.length; i++) {
                if (input[i][prop] <= rangeObj.max) results.push(input[i]);
            }
            return results;
        }
        // when .max undef
        else if (rangeObj.max === undefined || rangeObj.max === null) {
            for (i = 0; i < input.length; i++) {
                if (input[i][prop] >= rangeObj.min) results.push(input[i]);
            }
            return results;
        }
        // when min and max defined
        else {
            for (i = 0; i < input.length; i++) {
                if (input[i][prop] >= rangeObj.min && input[i][prop] <= rangeObj.max) {
                    results.push(input[i]);
                }
            }
            return results;
        }
    }
});

catalogueModule.filter('byTags', function() {
    return function(input, tagsArray, prop) {
        var matchedResults = [];
        if (!tagsArray) return input;
        else {
            for (var i = 0; i < input.length; i++) {
                var matched = 0;
                for (var t = 0; t < tagsArray.length; t++) {
                    for (var p = 0; p < input[i][prop].length; p++) {
                        if (input[i][prop][p].text == tagsArray[t].text) matched++;
                    }
                }
                if (matched == tagsArray.length) matchedResults.push(input[i]);
            }
            return matchedResults;
        }
    }
});

catalogueModule.filter('myUnique', function() {
    return function(input, prop) {

        var filtered = unique(input, prop);

        var results = [];
        for (var i = 0; i < filtered.length; i++) {
            results.push(filtered[i]);
        }
        return results;
    }
});

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
/**
 * Created by Slava on 11.01.2016.
 */

menuRootModule.directive('menuRoot', function()
{

    var controller = ['$scope', '$translate', '$translatePartialLoader', function($scope, $translate, $translatePartialLoader)
    {
        $translatePartialLoader.addPart('MenuRoot');

        // Language switch element
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
        };


    }];

    return {
        restrict: 'E',
        scope: {},
        controller: controller,
        templateUrl: '_templates/_menuRoot.html'
    }

});
/**
 * Created by Slava on 23.11.2015.
 */
var storage = [
    {
        'uid':'001',
        'name':'Обнимашки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'5',
        'brand':'Весельчак У',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'позитив'},
            {'text':'друзья'},
            {'text':'приятно'}
        ]
    },
    {
        'uid':'002',
        'name':'Грустняшки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'345',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'негатив'}
        ]
    },
    {
        'uid':'003',
        'name':'Радуга',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'14',
        'brand':'Весельчак У',
        'categoryID':'2',
        'tags': [
            {'text':'природа'},
            {'text':'позитив'}
        ]
    },
    {
        'uid':'004',
        'name':'Удивление',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'28',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags': [
            {'text':'эмоция'},
            {'text':'нейтрально'}
        ]
    },
    {
        'uid':'005',
        'name':'Обнимашки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'5',
        'brand':'Весельчак У',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'позитив'},
            {'text':'друзья'},
            {'text':'приятно'}
        ]
    },
    {
        'uid':'006',
        'name':'Грустняшки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'345',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'негатив'}
        ]
    },
    {
        'uid':'007',
        'name':'Радуга',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'14',
        'brand':'Весельчак У',
        'categoryID':'2',
        'tags': [
            {'text':'природа'},
            {'text':'позитив'}
        ]
    },
    {
        'uid':'008',
        'name':'Удивление',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'28',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags': [
            {'text':'эмоция'},
            {'text':'нейтрально'}
        ]
    },
    {
        'uid':'009',
        'name':'Обнимашки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'5',
        'brand':'Весельчак У',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'позитив'},
            {'text':'друзья'},
            {'text':'приятно'}
        ]
    },
    {
        'uid':'010',
        'name':'Грустняшки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'345',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'негатив'}
        ]
    },
    {
        'uid':'011',
        'name':'Радуга',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'14',
        'brand':'Весельчак У',
        'categoryID':'2',
        'tags': [
            {'text':'природа'},
            {'text':'позитив'}
        ]
    },
    {
        'uid':'012',
        'name':'Удивление',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'28',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags': [
            {'text':'эмоция'},
            {'text':'нейтрально'}
        ]
    },
    {
        'uid':'013',
        'name':'Обнимашки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'5',
        'brand':'Весельчак У',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'позитив'},
            {'text':'друзья'},
            {'text':'приятно'}
        ]
    },
    {
        'uid':'014',
        'name':'Грустняшки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'345',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'негатив'}
        ]
    },
    {
        'uid':'015',
        'name':'Радуга',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'14',
        'brand':'Весельчак У',
        'categoryID':'2',
        'tags': [
            {'text':'природа'},
            {'text':'позитив'}
        ]
    },
    {
        'uid':'016',
        'name':'Удивление',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'28',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags': [
            {'text':'эмоция'},
            {'text':'нейтрально'}
        ]
    },
    {
        'uid':'017',
        'name':'Обнимашки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'5',
        'brand':'Весельчак У',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'позитив'},
            {'text':'друзья'},
            {'text':'приятно'}
        ]
    },
    {
        'uid':'018',
        'name':'Грустняшки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'345',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'негатив'}
        ]
    },
    {
        'uid':'019',
        'name':'Радуга',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'14',
        'brand':'Весельчак У',
        'categoryID':'2',
        'tags': [
            {'text':'природа'},
            {'text':'позитив'}
        ]
    },
    {
        'uid':'020',
        'name':'Удивление',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'28',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags': [
            {'text':'эмоция'},
            {'text':'нейтрально'}
        ]
    },
    {
        'uid':'021',
        'name':'Обнимашки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'5',
        'brand':'Весельчак У',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'позитив'},
            {'text':'друзья'},
            {'text':'приятно'}
        ]
    },
    {
        'uid':'022',
        'name':'Грустняшки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'345',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'негатив'}
        ]
    },
    {
        'uid':'023',
        'name':'Радуга',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'14',
        'brand':'Весельчак У',
        'categoryID':'2',
        'tags': [
            {'text':'природа'},
            {'text':'позитив'}
        ]
    },
    {
        'uid':'024',
        'name':'Удивление',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'28',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags': [
            {'text':'эмоция'},
            {'text':'нейтрально'}
        ]
    },
    {
        'uid':'025',
        'name':'Обнимашки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'5',
        'brand':'Весельчак У',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'позитив'},
            {'text':'друзья'},
            {'text':'приятно'}
        ]
    },
    {
        'uid':'026',
        'name':'Грустняшки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'345',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'негатив'}
        ]
    },
    {
        'uid':'027',
        'name':'Радуга',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'14',
        'brand':'Весельчак У',
        'categoryID':'2',
        'tags': [
            {'text':'природа'},
            {'text':'позитив'}
        ]
    },
    {
        'uid':'028',
        'name':'Удивление',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'28',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags': [
            {'text':'эмоция'},
            {'text':'нейтрально'}
        ]
    },
    {
        'uid':'029',
        'name':'Обнимашки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'5',
        'brand':'Весельчак У',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'позитив'},
            {'text':'друзья'},
            {'text':'приятно'}
        ]
    },
    {
        'uid':'030',
        'name':'Грустняшки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'345',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'негатив'}
        ]
    },
    {
        'uid':'031',
        'name':'Радуга',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'14',
        'brand':'Весельчак У',
        'categoryID':'2',
        'tags': [
            {'text':'природа'},
            {'text':'позитив'}
        ]
    },
    {
        'uid':'032',
        'name':'Удивление',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'28',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags': [
            {'text':'эмоция'},
            {'text':'нейтрально'}
        ]
    },
    {
        'uid':'033',
        'name':'Обнимашки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'5',
        'brand':'Весельчак У',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'позитив'},
            {'text':'друзья'},
            {'text':'приятно'}
        ]
    },
    {
        'uid':'034',
        'name':'Грустняшки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'345',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'негатив'}
        ]
    },
    {
        'uid':'035',
        'name':'Радуга',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'14',
        'brand':'Весельчак У',
        'categoryID':'2',
        'tags': [
            {'text':'природа'},
            {'text':'позитив'}
        ]
    },
    {
        'uid':'036',
        'name':'Удивление',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'28',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags': [
            {'text':'эмоция'},
            {'text':'нейтрально'}
        ]
    },
    {
        'uid':'037',
        'name':'Обнимашки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'5',
        'brand':'Весельчак У',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'позитив'},
            {'text':'друзья'},
            {'text':'приятно'}
        ]
    },
    {
        'uid':'038',
        'name':'Грустняшки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'345',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'негатив'}
        ]
    },
    {
        'uid':'039',
        'name':'Радуга',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'14',
        'brand':'Весельчак У',
        'categoryID':'2',
        'tags': [
            {'text':'природа'},
            {'text':'позитив'}
        ]
    },
    {
        'uid':'040',
        'name':'Удивление',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'28',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags': [
            {'text':'эмоция'},
            {'text':'нейтрально'}
        ]
    },
    {
        'uid':'041',
        'name':'Обнимашки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'5',
        'brand':'Весельчак У',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'позитив'},
            {'text':'друзья'},
            {'text':'приятно'}
        ]
    },
    {
        'uid':'042',
        'name':'Грустняшки',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'345',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags':[
            {'text':'эмоция'},
            {'text':'негатив'}
        ]
    },
    {
        'uid':'043',
        'name':'Радуга',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'14',
        'brand':'Весельчак У',
        'categoryID':'2',
        'tags': [
            {'text':'природа'},
            {'text':'позитив'}
        ]
    },
    {
        'uid':'044',
        'name':'Удивление',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'28',
        'brand':'Морской ветер',
        'categoryID':'1',
        'tags': [
            {'text':'эмоция'},
            {'text':'нейтрально'}
        ]
    },
    {
        'uid':'045',
        'name':'Ми-ми-ми',
        'description':'Описание товара и все такое вообще, ага',
        'image':'goods/hugs.gif',
        'price':'150',
        'brand':'УгрюмКорп',
        'categoryID':'2',
        'tags': [
            {'text':'эмоция'},
            {'text':'нежность'},
            {'text':'позитив'}
        ]
    }
];

var categories = [
    {
        'id':'1',
        'name':'Разные няшки'
    },
    {
        'id':'2',
        'name':'Серьезные штуки'
    }
];
/**
 * Created by Slava on 21.11.2015.
 */
//function uniq(a) {
//    var seen = {};
//    return a.filter(function(item) {
//        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
//    });
//}

//
function unique(z, prop){
    // first - clone the input to stay on the safe side
    var c = z.slice(0);
    c.sort(function (a,b){
        //if a numbers in input
        //if (a[prop] > b[prop]) return 1;
        //if (a[prop] < b[prop]) return -1;
        //if string in input
        return a[prop].localeCompare(b[prop]);
    });
    for(var i = 1; i < c.length; ){
        if(c[i-1][prop] == c[i][prop]){
            c.splice(i, 1);
        } else {
            i++;
        }
    }
    return c;
}