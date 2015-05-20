(function() {
    'use strict';

     angular
        .module('app')
        .controller('DialogController', DialogController);

    DialogController.$inject = ['$mdDialog'];
    function DialogController($mdDialog) {
        var vm = this;

        vm.task = {};
        vm.cancel = cancel;
        vm.success = success;

        ////////////

        function cancel() {
            $mdDialog.cancel();
        }

        function success(task) {
            $mdDialog.hide(task);
        }
    }

})();