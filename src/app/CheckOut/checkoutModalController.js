checkOutModule.controller('checkoutConfirmModalCtrl', ['$uibModalInstance', function ($uibModalInstance) {

    var vm = this;

    vm.ok = function () {
        $uibModalInstance.close('success');
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);