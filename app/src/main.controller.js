(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    MainController.$inject = ['$q', '$filter', '$timeout', '$indexedDB', '$mdDialog', '$mdSidenav', 'taskService'];
    function MainController($q, $filter, $timeout, $indexedDB, $mdDialog, $mdSidenav, taskService) {
        var vm = this;
        vm.tasks = [];
        vm.filteredTasks = [];
        vm.filter = 'all';
        vm.selectTask = selectTask;
        vm.clearTasks = clearTasks;
        vm.showForm = showForm;
        vm.save = save;
        vm.toggleSidebar = toggleSidebar;
        vm.filterTasks = filterTasks;
        vm.isElem = isElem;
        vm.confirm = confirm;
        // vm.newtask = {};
        vm.selected = {};

        vm.debug = function() {
            console.log('vm.filter', vm.filter);
        };

        ////////////

        function loadTasks() {
            taskService.getAll().then(function(tasks) {
                vm.tasks = tasks;
                vm.filterTasks();
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
        function save(task, timeout) {
            function saveFunc() {
                taskService.save(task).then(function() {
                    //update tasks list
                    loadTasks();
                });
            }

            if (typeof timeout !== 'undefined') {
                $timeout(function() {
                    saveFunc();
                    if (vm.filter !== 'all') {
                        vm.selected = {};
                    }
                }, 300);
            }
            else {
                saveFunc();
                vm.selected = task;
            }
        }


        function toggleSidebar() {
            // var pending = $mdBottomSheet.hide() || $q.when(true);
            var pending = $q.when(true);
            pending.then(function(){
                $mdSidenav('left').toggle();
            });
        }


        /**
         * Filter list of task according to selected tab
         */
        function filterTasks(filter) {
            if (typeof filter !== 'undefined') {
                vm.filter = filter;
                vm.selected = {};
            }

            vm.filteredTasks = $filter('filter')(vm.tasks, function(task) {
                if      (vm.filter == 'all')  { return true; }
                else if (vm.filter == 'todo') { return !task.done; }
                else if (vm.filter == 'done') { return task.done; }
            });
        }


        function isElem(elemName, event) {
            // console.log("target", event);
            return elemName == event.target.localName;
        }

        function confirm(ev, cb) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Are tou sure ?')
                .content('Do you really want to clear all the tasks ?')
                // .content('All of the banks have agreed to forgive you your debts.')
                .ariaLabel('Confirm choice')
                .ok('YES')
                .cancel('NO')
                .targetEvent(ev);

            $mdDialog.show(confirm).then(function() {
                cb();
            }, function() {
                console.log('Action aborted');
            });
        }

    }
})();
