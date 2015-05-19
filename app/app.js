/**
 * Following JohnPapa angular styleguide...
 * https://github.com/johnpapa/angular-styleguide
 */
(function() {
    'use strict';

    angular
        .module('app', [
            'indexedDB',
            'ngMaterial'
        ])
        .config(AppConfig)
        .constant('cfg', {
            'storeName': 'task'
        });


    AppConfig.$inject = ['$indexedDBProvider', '$mdThemingProvider', '$mdIconProvider', 'cfg'];
    function AppConfig($indexedDBProvider, $mdThemingProvider, $mdIconProvider, cfg) {

        $indexedDBProvider
            .connection('appIndexedDB')
            .upgradeDatabase(1, function(event, db, tx){
                var objStore = db.createObjectStore(cfg.storeName, {
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

})();
