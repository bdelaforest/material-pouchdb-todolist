(function() {
    'use strict';

    angular
        .module('app')
        .factory('taskService', TaskService);


    TaskService.$inject = ['$q', 'cfg', 'pouchDB'];
    function TaskService($q, cfg, pouchDB) {

        var service = {
            save:   save,
            getOne: getOne,
            getAll: getAll,
            clearTasks: clearTasks
        };

        return service;

        ////////////

        function save(task) {
            var deferred = $q.defer();

            //promise callbacks
            function success(response) {
                deferred.resolve(response);
            }
            function error(err) {
                console.log('After insert error', err);
            }

            if (!task._id) {
                var date = new Date().toISOString();
                task._id       = date;
                task.createdAt = date;
                task.done      = false;
            }

            pouchDB.put(task)
                .then(success)
                .catch(error);

            return deferred.promise;
        }


        function getOne(id) {
            return pouchDB.get(id);
        }

        function getAll(filter) {
            var deferred = $q.defer(),
                status   = '',
                options  = {include_docs : true};

            function success(response) {
                var tasks = [];
                for(var i in response.rows) {
                    tasks.push(response.rows[i].doc);
                }
                deferred.resolve(tasks);
            }
            function error(err) {
                console.log('Error', err)
            }


            if (typeof filter === 'undefined' || filter === 'all') {
                pouchDB.allDocs(options)
                    .then(success)
                    .catch(error);
            }
            else {
                if      (filter === 'todo') { status = false; }
                else if (filter === 'done') { status = true; }

                pouchDB.query(function (doc, emit) {
                    if (doc.done === status) { emit(doc); }
                }, options)
                    .then(success)
                    .catch(error);
            }

            return deferred.promise;
        }

        function clearTasks(filter) {
            var deferred = $q.defer();

            getAll(filter).then(function(tasks) {
                _.each(tasks, function(task, i) {
                    tasks[i]._deleted = true;
                });
                pouchDB.bulkDocs(tasks).then(function(result) {
                    deferred.resolve(result);
                });
            });

            return deferred.promise;
        }
    }

})();
