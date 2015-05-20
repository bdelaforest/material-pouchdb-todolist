(function() {
    'use strict';

    angular
        .module('app')
        .controller('TasksController', TasksController);

    TasksController.$inject = ['$q', '$filter', '$timeout', '$mdDialog', '$mdSidenav', 'taskService', 'pouchDB'];
    function TasksController($q, $filter, $timeout, $mdDialog, $mdSidenav, taskService, pouchDB) {
        var vm = this;

        // View Variables
        vm.tasks         = [];
        vm.filteredTasks = [];
        vm.filter        = 'all';
        vm.selectTask    = selectTask;
        vm.clearTasks    = clearTasks;
        vm.showForm      = showForm;
        vm.save          = save;
        vm.toggleSidebar = toggleSidebar;
        vm.filterTasks   = filterTasks;
        vm.isElem        = isElem;
        vm.confirm       = confirm;
        vm.selected      = {};

        vm.debug = function(arg) {
            console.log('debug', arg);
        };

        ////////////

        function loadTasks() {
            taskService.getAll(vm.filter).then(function(tasks) {
                vm.tasks = tasks;

                //check selected
                var idx = _.findIndex(vm.tasks, function(task) {
                        return task._id == vm.selected._id;
                    });

                //select task only if visible in list
                if (idx >= 0) { vm.selected = vm.tasks[idx]; }
                else          { vm.selected = {} }
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

        /**
         * Clear scoped tasks ('done' for now)
         */
        function clearTasks() {
            taskService.clearTasks('done').then(function() {
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
                vm.selected = task;
                $timeout(function() {
                    saveFunc();
                }, 300);
            }
            else {
                saveFunc();
            }
        }


        function toggleSidebar() {
            var pending = $q.when(true);
            pending.then(function(){
                $mdSidenav('left').toggle();
            });
        }


        /**
         * Filter list of task according to selected tab
         */
        function filterTasks(filter) {
            vm.filter = filter;
            loadTasks();
        }


        function isElem(elemName, event) {
            return elemName == event.target.localName;
        }

        function confirm(ev, cb) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Are you sure ?')
                .content('Do you really want to clear all the tasks marked as DONE ?')
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
