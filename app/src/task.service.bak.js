(function() {
    'use strict';

    angular
        .module('app')
        .factory('taskService', TaskService);


    TaskService.$inject = ['$indexedDB', '$q', 'cfg'];
    function TaskService($indexedDB, $q, cfg) {

        var service = {
            save:   save,
            getOne: getOne,
            getAll: getAll,
            clearTasks: clearTasks
        };

        return service;

        ////////////

        function openStore(callback) {
            $indexedDB.openStore(cfg.storeName, callback);
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
                    var d = new Date();
                    task.createdAt = d.toISOString();
                    task.done      = false;
                    store.insert(task).then(function() {
                        success();
                    },
                    function(err) {
                        console.log('After insert error', err);
                    });
                }

            });

            return deferred.promise;
        }


        function getOne(id) {
            return null;
        }


        function getAll() {
            var deferred = $q.defer();

            openStore(function(store) {
                store.getAll().then(function(tasks) {
                    console.log("tasks", tasks)
                    return deferred.resolve(tasks);
                });

                // store.count().then(function(val) {
                //     console.log(val);
                //     if (val > 0) {
                //         store.findWhere(store.query().$index('done').$eq('true')).then(function(tasks) {
                //         // store.find(2).then(function(tasks) {
                //         store.getAll(filter).then(function(tasks) {
                //             console.log("tasks", tasks)
                //             return deferred.resolve(tasks);
                //         });
                //     }
                // });
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
