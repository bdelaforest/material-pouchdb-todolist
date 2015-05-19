/**
 * Following JohnPapa angular styleguide...
 * https://github.com/johnpapa/angular-styleguide
 */
(function() {
    'use strict';
    var OBJECT_STORE_NAME = 'task';

    angular
        .module('app', [
            'indexedDB',
            'ngMaterial'
        ])
        .config(AppConfig)
        .controller('MainController', MainController)
        .factory('taskService', TaskService);


    AppConfig.$inject = ['$indexedDBProvider', '$mdThemingProvider', '$mdIconProvider'];
    function AppConfig($indexedDBProvider, $mdThemingProvider, $mdIconProvider) {

        $indexedDBProvider
            .connection('appIndexedDB')
            .upgradeDatabase(1, function(event, db, tx){
                var objStore = db.createObjectStore(OBJECT_STORE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                // objStore.createIndex('id_idx', 'id', {unique: true});
                // objStore.createIndex('cat_idx', 'cat', {unique: false});
            });


        $mdIconProvider
            .icon("menu", "app/assets/svg/menu.svg", 24);

        $mdThemingProvider.theme('default')
            // .primaryPalette('brown')
            .accentPalette('brown');

    }


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

        // function addTask(task) {
        //     taskService.save(task).then(function() {
        //         //update tasks list
        //         loadTasks();
        //     });
        // }

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
                controller: DialogController,
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


    TaskService.$inject = ['$indexedDB', '$q'];
    function TaskService($indexedDB, $q) {

        var service = {
            save:   save,
            getOne: getOne,
            getAll: getAll,
            clearTasks: clearTasks
        };

        return service;

        ////////////

        function openStore(callback) {
            $indexedDB.openStore(OBJECT_STORE_NAME, callback);
        }

        function save(task) {
            var deferred = $q.defer();
            console.log('save', task);

            function success() {
                console.log('After insert success', task);
                deferred.resolve();
            }

            openStore(function(store) {

                console.log('Before insert ', task);

                if (task.id) {
                    store.upsert(task).then(function() {
                        success();
                    },
                    function(err) {
                        console.log('After insert error', err);
                    });
                }
                else {
                    store.insert(task).then(function() {
                        success();
                    },
                    function(err) {
                        console.log('After insert error', err);
                    });
                }

            })

            return deferred.promise;
        }


        function getOne(id) {
            return null;
        }


        function getAll() {
            var deferred = $q.defer();

            openStore(function(store) {
                store.getAll().then(function(tasks) {
                    return deferred.resolve(tasks);
                });
            });

            return deferred.promise;
        }

        function clearTasks() {
            var deferred = $q.defer();

            openStore(function(store) {
                store.clear().then(function() {
                    return deferred.resolve();
                });
            });

            return deferred.promise;
        }
    }


})();
