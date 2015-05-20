/**
 * Following JohnPapa angular styleguide...
 * https://github.com/johnpapa/angular-styleguide
 */
(function() {
    'use strict';

    angular
        .module('app', [
            'indexedDB',
            'ngMaterial',
            'pouchDB',
            // 'ngSanitize'
            // 'ngAnimate'
        ])
        .filter('nl2br', nl2br)
        .config(AppConfig)
        .constant('cfg', {
            'storeName': 'task',
            'pouchDBName': 'tasks',
            'pouchDBRemote': 'https://bdelaforest.iriscouch.com/',
            // 'pouchDBRemote': 'http://localhost:5984/'
        });


    AppConfig.$inject = ['$indexedDBProvider', '$mdThemingProvider', '$mdIconProvider', 'cfg'];
    function AppConfig($indexedDBProvider, $mdThemingProvider, $mdIconProvider, cfg) {

        // $indexedDBProvider
        //     .connection('todos')
        //     .upgradeDatabase(1, function(event, db, tx){
        //         var objStore = db.createObjectStore(cfg.storeName, {
        //             keyPath: 'id',
        //             autoIncrement: true
        //         });
        //         // objStore.createIndex('done', 'done', {unique: false});
        //     });

        $mdIconProvider
            .icon("menu", "app/assets/svg/menu.svg", 24);

        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('blue');

        // pouchDB.init();
    }

    nl2br.$inject = ['$sce'];
    function nl2br($sce) {
        return function(input) {
            if (input !== void 0) {
                return $sce.trustAsHtml(input.replace(/\n/g, '<br>'));
            }
        };
    }

})();
