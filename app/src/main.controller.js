(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    MainController.$inject = ['$q', '$indexedDB', '$mdDialog', '$mdSidenav', 'taskService'];
    function MainController($q, $indexedDB, $mdDialog, $mdSidenav, taskService) {
        var vm = this;

        vm.tasks = [];
        vm.selectTask = selectTask;
        vm.clearTasks = clearTasks;
        vm.showForm = showForm;
        vm.save = save;
        vm.toggleSidebar = toggleSidebar;
        // vm.newtask = {};
        vm.selected = false;


        ////////////

        function loadTasks() {
            taskService.getAll().then(function(tasks) {
                vm.tasks = tasks;
            });
        }

        loadTasks();


        /**
         * ViewModel functions
         */

        function selectTask(task) {
            var pending = $mdSidenav('left').close() || $q.when(true);

            pending.then(function(){
                vm.selected = task;
            });
        }

        function clearTasks() {
            taskService.clearTasks().then(function() {
                //update tasks list
                loadTasks();
            });
        }

        function showForm(ev) {
            $mdDialog.show({
                controller: 'DialogController',
                controllerAs: 'vm',
                templateUrl: 'app/newTaskForm.tpl.html',
                targetEvent: ev,
            })
            .then(function(task) {
                save(task);
            });
        };


        // function toggleState(task) {
        function save(task) {
            // task.done = !task.done;
            taskService.save(task).then(function() {
                //update tasks list
                loadTasks();
            });
        }


         function toggleSidebar() {

            // var pending = $mdBottomSheet.hide() || $q.when(true);
            var pending = $q.when(true);

            pending.then(function(){
                $mdSidenav('left').toggle();
            });
        }
    }
})();
