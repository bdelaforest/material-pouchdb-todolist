(function() {
    'use strict';

    angular
        .module('pouchDB', [])
        .factory('pouchDB', PouchDBService);

    PouchDBService.$inject = ['cfg'];
    function PouchDBService(cfg) {
        //create DB
        var db = new PouchDB(cfg.pouchDBName, {
            auto_compaction: true
        });

        //Sync remote and local DB
        db.sync(cfg.pouchDBRemote+cfg.pouchDBName, {
            live: true,
            retry: true
        });

        return db;
    }

})();
