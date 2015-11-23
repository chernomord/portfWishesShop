/**
 * Created by Slava on 19.11.2015.
 */
var funshopApp = angular.module('funshopApp', [
    'ngRoute',
    'ui',
    'ngTagsInput',
    'funshopFilters'
]);

funshopApp.controller('goodiesListCtrl', function($scope) {
    var goodies = [
        {
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
    $scope.goodies = goodies;

    $scope.categories = [
        {
            'id':'1',
            'name':'Разные няшки'
        },
        {
            'id':'2',
            'name':'Серьезные штуки'
        }
    ];


    $scope.loadTags = function(query) {

        // SEPARETE_SERVICE_CANDIDATE
        function unique(a, prop){
            a.sort(function (a,b){
                //if a numbers in input
                //if (a[prop] > b[prop]) return 1;
                //if (a[prop] < b[prop]) return -1;
                //if string in input
                return a[prop].localeCompare(b[prop]);
            });
            for(var i = 1; i < a.length; ){
                if(a[i-1][prop] == a[i][prop]){
                    a.splice(i, 1);
                } else {
                    i++;
                }
            }
            return a;
        }

        var allTagsList = [],
            filteredTags = [];
        // SEPARETE_SERVICE_CANDIDATE
        for (var i = 0; i<goodies.length; i++) {
            allTagsList.push.apply(allTagsList, goodies[i].tags);
        }
        allTagsList = unique(allTagsList, 'text');
        for (i = 0; i < allTagsList.length; i++) {
            if (allTagsList[i].text.indexOf(query) !== -1) filteredTags.push(allTagsList[i]);
        }
        return filteredTags;
    }

});

