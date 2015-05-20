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
        .config(AppConfig)
        .constant('cfg', {
            'storeName': 'task',
            'pouchDBName': 'tasks'
        });


    AppConfig.$inject = ['$indexedDBProvider', '$mdThemingProvider', '$mdIconProvider', 'cfg'];
    function AppConfig($indexedDBProvider, $mdThemingProvider, $mdIconProvider, cfg) {

        $indexedDBProvider
            .connection('todos')
            .upgradeDatabase(1, function(event, db, tx){
                var objStore = db.createObjectStore(cfg.storeName, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                // objStore.createIndex('done', 'done', {unique: false});
            });

        $mdIconProvider
            .icon("menu", "app/assets/svg/menu.svg", 24);

        $mdThemingProvider.theme('default')
            // .primaryPalette('brown')
            .accentPalette('indigo');


        // pouchDB.init();
    }

})();
