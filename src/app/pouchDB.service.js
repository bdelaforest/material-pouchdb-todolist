(function() {
    'use strict';

    angular
        .module('pouchDB', [])
        .factory('pouchDB', PouchDBService);

    PouchDBService.$inject = ['$rootScope', 'cfg'];
    function PouchDBService($rootScope, cfg) {
        var remoteDB = cfg.pouchDBRemote+cfg.pouchDBName;
        //create DB
        var db = new PouchDB(cfg.pouchDBName, {
            auto_compaction: true
        });

        // Replicate DB if needed
        var sync = db.replicate.from(remoteDB);

        sync.then(function() {
            // //Sync remote and local DB
            db.sync(remoteDB, {
                live: true,
                retry: true
            });
        });

        return {
            db: db,
            sync: sync
        };
    }

})();
