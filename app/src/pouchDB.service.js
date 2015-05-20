(function() {
    'use strict';

    angular
        .module('pouchDB', [])
        .factory('pouchDB', PouchDBService);

    PouchDBService.$inject = ['$q', 'cfg'];
    function PouchDBService($q, cfg) {
        // var service = {
        //     // db: new PouchDB('http://localhost:5984/'+cfg.pouchDBName),
        //     db: new PouchDB(cfg.pouchDBName),
        //     getInfo: getInfo
        // };

        return (new PouchDB(cfg.pouchDBName));

        ////////////

        // /**
        //  * Connect / Create DB
        //  */
        // function init() {
        //     service.db = new PouchDB('http://localhost:5984/'+cfg.pouchDBName);
        // }
        // init();

        /**
         * Return promise
         */
        // function getInfo() {
        //     // return service.db.info();
        //     service.db.info().then(function(info) {
        //         console.log('DB Info', info);
        //     }, function() {
        //         console.log('Error fetching DB');
        //     });
        // }
    }

})();


// var db = new PouchDB('kittens');
