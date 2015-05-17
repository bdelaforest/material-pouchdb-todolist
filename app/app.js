/**
 * Following JohnPapa angular styleguide...
 * https://github.com/johnpapa/angular-styleguide
 */
(function() {
    'use strict';
    var OBJECT_STORE_NAME = 'task';

    angular
        .module('app', [
            'indexedDB'
        ])
        .config(AppConfig)
        .controller('MainController', MainController)
        .factory('taskService', TaskService);


    AppConfig.$inject = ['$indexedDBProvider'];
    function AppConfig($indexedDBProvider) {

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
    }


    MainController.$inject = ['taskService', '$indexedDB'];
    function MainController(taskService, $indexedDB) {
        var vm = this;

        vm.tasks = [];
        vm.addTask = addTask;
        vm.clearTasks = clearTasks;
        vm.toggleState = toggleState;
        vm.newtask = {};


        ////////////

        function loadTasks() {
            taskService.getAll().then(function(tasks) {
                console.log("TASKS", tasks);
                vm.tasks = tasks;
            });
        }

        loadTasks();


        /**
         * ViewModel functions
         */

        function addTask() {
            console.log("Add new task !", vm.newtask);
            taskService.save(vm.newtask).then(function(){
                //clear form
                vm.newtask = {};

                //update tasks list
                loadTasks();
            });
        }


        function clearTasks() {
            taskService.clearTasks().then(function() {
                //update tasks list
                loadTasks();
            });
        }


        function toggleState(task) {
            task.done = !task.done;
            taskService.save(task).then(function() {
                //update tasks list
                loadTasks();
            });
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
