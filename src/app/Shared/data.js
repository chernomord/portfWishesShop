var abstract_json = [
    {
        "uid":"c01u001",
        "name":"Обнимашки",
        "description":"Описание товара и все такое вообще, ага",
        "image":"goods/hugs.gif",
        "price":"5",
        "brand":"Весельчак У",
        "categoryID":"1",
        "tags":[
            {"text":"эмоция"},
            {"text":"позитив"},
            {"text":"друзья"},
            {"text":"приятно"}
        ]
    },
    {
        "uid":"c01u002",
        "name":"Грустняшки",
        "description":"Описание товара и все такое вообще, ага",
        "description_long" : "Какое-то очумительно длинное описание специально для карточки товара",
        "image":"goods/hugs.gif",
        "price":"345",
        "brand":"Морской ветер",
        "categoryID":"1",
        "tags":[
            {"text":"эмоция"},
            {"text":"негатив"}
        ]
    },
    {
        "uid":"c01u003",
        "name":"Радуга",
        "description":"Описание товара и все такое вообще, ага",
        "image":"goods/hugs.gif",
        "price":"14",
        "brand":"Весельчак У",
        "categoryID":"2",
        "tags": [
            {"text":"природа"},
            {"text":"позитив"}
        ]
    },
    {
        "uid":"c01u004",
        "name":"Удивление",
        "description":"Описание товара и все такое вообще, ага",
        "image":"goods/hugs.gif",
        "price":"28",
        "brand":"Морской ветер",
        "categoryID":"1",
        "tags": [
            {"text":"эмоция"},
            {"text":"нейтрально"}
        ]
    },
    {
        "uid":"c01u005",
        "name":"Обнимашки",
        "description":"Описание товара и все такое вообще, ага",
        "image":"goods/hugs.gif",
        "price":"5",
        "brand":"Весельчак У",
        "categoryID":"1",
        "tags":[
            {"text":"эмоция"},
            {"text":"позитив"},
            {"text":"друзья"},
            {"text":"приятно"}
        ]
    },
    {
        "uid":"c01u006",
        "name":"Грустняшки",
        "description":"Описание товара и все такое вообще, ага",
        "image":"goods/hugs.gif",
        "price":"345",
        "brand":"Морской ветер",
        "categoryID":"1",
        "tags":[
            {"text":"эмоция"},
            {"text":"негатив"}
        ]
    },
    {
        "uid":"c01u007",
        "name":"Радуга",
        "description":"Описание товара и все такое вообще, ага",
        "image":"goods/hugs.gif",
        "price":"14",
        "brand":"Весельчак У",
        "categoryID":"2",
        "tags": [
            {"text":"природа"},
            {"text":"позитив"}
        ]
    },
    {
        "uid":"c01u008",
        "name":"Удивление",
        "description":"Описание товара и все такое вообще, ага",
        "image":"goods/hugs.gif",
        "price":"28",
        "brand":"Морской ветер",
        "categoryID":"1",
        "tags": [
            {"text":"эмоция"},
            {"text":"нейтрально"}
        ]
    },
    {
        "uid":"c01u009",
        "name":"Обнимашки",
        "description":"Описание товара и все такое вообще, ага",
        "image":"goods/hugs.gif",
        "price":"5",
        "brand":"Весельчак У",
        "categoryID":"1",
        "tags":[
            {"text":"эмоция"},
            {"text":"позитив"},
            {"text":"друзья"},
            {"text":"приятно"}
        ]
    },
    {
        "uid":"c01u010",
        "name":"Грустняшки",
        "description":"Описание товара и все такое вообще, ага",
        "image":"goods/hugs.gif",
        "price":"345",
        "brand":"Морской ветер",
        "categoryID":"1",
        "tags":[
            {"text":"эмоция"},
            {"text":"негатив"}
        ]
    },
    {
        "uid":"c01u011",
        "name":"Радуга",
        "description":"Описание товара и все такое вообще, ага",
        "image":"goods/hugs.gif",
        "price":"14",
        "brand":"Весельчак У",
        "categoryID":"2",
        "tags": [
            {"text":"природа"},
            {"text":"позитив"}
        ]
    },
    {
        "uid":"c01u012",
        "name":"Удивление",
        "description":"Описание товара и все такое вообще, ага",
        "image":"goods/hugs.gif",
        "price":"28",
        "brand":"Морской ветер",
        "categoryID":"1",
        "tags": [
            {"text":"эмоция"},
            {"text":"нейтрально"}
        ]
    }
];

var material_json = [
    {
        "uid":"c02u001",
        "name":"Загородный дом",
        "description":"Описание товара и все такое вообще, ага",
        "image":"goods/hugs.gif",
        "price":"2800",
        "brand":"Добрый Енот",
        "categoryID":"1",
        "tags": [
            {"text":"недвижимость"},
            {"text":"уют"}
        ]
    },
    {
        "uid":"c02u002",
        "name":"Машинка",
        "description":"Описание товара и все такое вообще, ага",
        "image":"goods/hugs.gif",
        "price":"2800",
        "brand":"Добрый Енот",
        "categoryID":"1",
        "tags": [
            {"text":"недвижимость"},
            {"text":"уют"}
        ]
    },
    {
        "uid":"c02u003",
        "name":"Катер",
        "description":"Описание товара и все такое вообще, ага",
        "image":"goods/hugs.gif",
        "price":"2800",
        "brand":"Добрый Енот",
        "categoryID":"1",
        "tags": [
            {"text":"недвижимость"},
            {"text":"уют"}
        ]
    }
];


var categories = [
    {
        "id":"1",
        "http_request": "abstract.json",
        "name":"Абстрактные"
    },
    {
        "id":"2",
        "http_request": "material.json",
        "name":"Конктретные"
    }
];