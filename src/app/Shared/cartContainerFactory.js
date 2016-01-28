funshopApp.factory('cartContainer', ['$cookies', function($cookies){
    var _cartItemProto = {
        uid : '',
        qty     : '',
        price   : '',
        name : '',
        description: '',
        image: ''
    };
    var cartContainer = [];
    if ($cookies.get('localCart')) {
        cartContainer = $cookies.getObject('localCart');
    }

    var cart = {
        items: cartContainer,
        totalItems: function () {
            var totalCount = 0;
            for (var i=0; i < this.items.length; i++) {
                totalCount += parseInt((this.items[i].qty), 10);
            }
            return totalCount
        },
        totalPrice: function() {
            var totalPrice = 0;
            for (var i = 0; i < this.items.length; i++ ) {
                totalPrice += (this.items[i].qty * this.items[i].price);
            }
            return totalPrice
        },
        addItem: function(newItem) {
            var found = false;
            for (var i=0; i < this.items.length; i++) {
                if (this.items[i].uid == newItem.uid) {
                    this.items[i].qty += newItem.qty;
                    found = true;
                }
            }
            if (!found) {
                if (!newItem.qty) { newItem.qty = 1; }
                newItem.description = newItem.description.slice(0,51);
                this.items.push(newItem);
            }
        },
        minusItem: function(itemUID) {
            for (var i=0; i < this.items.length; i++) {
                if (this.items[i].uid == itemUID) {
                    var qty = this.items[i].qty;
                    this.items[i].qty = qty - 1;
                    if (this.items[i].qty < 1 ) {
                        this.items[i].qty = 1;
                    }
                }
            }
        },
        plusItem: function(itemUID) {
            for (var i=0; i < this.items.length; i++) {
                if (this.items[i].uid == itemUID) {
                    var qty = this.items[i].qty;
                    this.items[i].qty++;
                }
            }
        },
        removeItemType: function(itemUID) {
            for (var i=0; i < this.items.length; i++) {
                if (this.items[i].uid == itemUID) {
                    this.items.splice(i,1);
                }
            }
        }
    };

    return {
        addItem: function(newItem) {
            cart.addItem(newItem);
            $cookies.putObject('localCart', cart.items);
        },
        minusItem: function(itemUID) {
            cart.minusItem(itemUID);
            $cookies.putObject('localCart', cart.items);
        },
        plusItem: function(itemUID){
            cart.plusItem(itemUID);
            $cookies.putObject('localCart', cart.items);
        },
        readItems: function() {
            return cart.items
        },
        itemCount: function() {
            return cart.totalItems();
        },
        totalPrice: function() {
            return cart.totalPrice();
        },
        emptyCart: function() {
            cart.items = [];
            $cookies.remove('localCart');
        },
        removeItemType: function(itemUID) {
            cart.removeItemType(itemUID);
            $cookies.putObject('localCart', cart.items);
        }
    };
}]);