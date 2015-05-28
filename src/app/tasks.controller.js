(function() {
    'use strict';

    angular
        .module('app')
        .controller('TasksController', TasksController);

    TasksController.$inject = ['$scope', '$q', '$filter', '$timeout', '$mdDialog', '$mdSidenav', 'taskService', 'pouchDB'];
    function TasksController($scope, $q, $filter, $timeout, $mdDialog, $mdSidenav, taskService, pouchDB) {
        var vm = this,
            iconEdit = 'edit',
            iconSave = 'save';

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
        vm.toggleEdit    = toggleEdit;
        vm.editMode      = false;
        vm.loading       = false;
        vm.editIcon      = iconEdit;
        vm.selected      = {};
        vm.iconOptions   = {
            // 'rotation': 'none',
            'duration': 300,
        };

        vm.debug = function(arg) {
            console.log('debug', arg);
        };

        ////////////

        function loadTasks() {
            var deferred = $q.defer();

            taskService.getAll(vm.filter).then(function(tasks) {
                vm.tasks = tasks;

                //check selected
                var idx = _.findIndex(vm.tasks, function(task) {
                        return task._id == vm.selected._id;
                    });

                //select task only if visible in list
                if (idx >= 0) { vm.selected = vm.tasks[idx]; }
                else          { vm.selected = {} }

                deferred.resolve(tasks);
            });

            return deferred.promise;
        }


        //loadTasks first change (to load tasks after sync end)
        pouchDB.sync
            .on('active', function() {
                //$timeout forces a $scope.$apply()
                $timeout(function() {
                    vm.loading = true;
                }, 0);
            })
            .on('complete', function() {
                vm.loading = false;
                loadTasks();
            });
        loadTasks();


        //toggle edit icon if needed
        function checkEditIcon() {
            vm.editIcon = vm.editMode ? iconSave : iconEdit;
        }


        /**
         * ViewModel functions
         */

        function selectTask(task) {
            if (task._id !== vm.selected._id) {
                vm.editMode = false;
                checkEditIcon();

                var pending = $mdSidenav('left').close() || $q.when(true);

                vm.selected = {};

                //reset vm.selected to trigger ng-show animation
                $timeout(function() {
                    pending.then(function(){
                        vm.selected = task;
                    });
                }, 0);
            }
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

        function showForm(ev, target) {
            $mdDialog.show({
                controller: 'DialogController',
                controllerAs: 'vm',
                templateUrl: 'app/dialog.task.tpl.html',
                targetEvent: ev,
                locals: {
                    task: target,
                }
            })
            .then(function(task) {
                save(task);
            });
        }

        function toggleEdit(target, forceActive) {
            //save if we were in editMode
            !forceActive && vm.editMode && save(target);

            //toggle edit mode
            vm.editMode = forceActive || !vm.editMode;

            //toggle icon
            checkEditIcon();
        }


        // function toggleState(task) {
        function save(task, timeout) {
            taskService.save(task).then(function() {
                //update tasks list
                loadTasks();
            });
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
