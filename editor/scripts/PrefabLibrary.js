/**
 * Copyright (C) 2018-2020 Scott Henshaw, All rights Reserved
 */
'use strict';

import Prefab from './Prefab.js'

export default class PrefabLibrary {

    constructor( $view ) {

        this.prefabList = [];
        this.$library = $view;

        this._toNumber = val => 1 * val;
    }

    find( id ) {
        // search the list for the prefab with matching id
        if (id === undefined)
            return undefined;

        // great place for .filter .map  .reduce
        const shortList = this.prefabList.filter( item => (item.id == id));
        return shortList[0]
    }

    at( index ) {

        return this.prefabList[this._toNumber( index )]
    }

    fetch( userid ) {
        // go get all the prefabs, put them in the library widget provided
        $.post(`/api/get_object_list/${userid}`, { type:"object" })
            .then( resultString => JSON.parse( resultString ))
            .then( result => result.payload )
            .then( objectList => {
                objectList.forEach(( itemName, index ) => {

                    // Create the item for the visual list
                    const $item = $(`<li name="${itemName}" class="game-object" value="${index}"></li>`);
                    this.$library.append( $item );

                    // Defer fetching the actual library item until we have a list of what to get
                    // then just update the css on resolve
                    let prefab = new Prefab().fetch( itemName, userid )
                        .then( prefab => {
                            this.prefabList.push( prefab );
                            const $pre = $(prefab.markup());
                            $item.append( $pre );

                            Prefab.RegisterDraggable( $pre )
                        })
                        .catch( error => console.log( error ));
                })

                // add the ability to drag the thing to the prefab element
                // must be part of the DOM before we add handlers
        })
    }
}
