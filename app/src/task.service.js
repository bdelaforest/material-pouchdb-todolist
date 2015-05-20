(function() {
    'use strict';

    angular
        .module('app')
        .factory('taskService', TaskService);


    TaskService.$inject = ['$indexedDB', '$q', 'cfg', 'pouchDB'];
    function TaskService($indexedDB, $q, cfg, pouchDB) {

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

            //promise callbacks
            function success(response) {
                console.log('After insert success', response);
                deferred.resolve(response);
            }

            function error(err) {
                console.log('After insert error', err);
            }


            if (task._id) {
                pouchDB.put(task).then(success, error);
            }
            else {
                task.createdAt = d.toISOString();
                task.done      = false;

                pouchDB.post(task).then(success, error);
            }

            return deferred.promise;
        }


        function getOne(id) {
            return pouchDB.get(id);
        }


        function getAll(filter) {
            var status = '';

            console.log("filter", pouchDB);

            if (typeof filter === 'undefined' || filter === 'all') {
                return pouchDB.allDocs();
            }

            else if (filter === 'todo') { status = false; }
            else if (filter === 'done') { status = true; }

            return pouchDB.query(function(doc, emit) {
                if (doc.done === status) { emit(doc); }
            });
        }

        function clearTasks() {
            return pouchDB.destroy();
            // var deferred = $q.defer();

            // openStore(function(store) {
            //     store.clear().then(function() {
            //         return deferred.resolve();
            //     });
            // });

            // return deferred.promise;
        }
    }

})();
