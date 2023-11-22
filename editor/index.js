/**
 * Copyright (C) 2018-2020 Scott Henshaw, All rights Reserved
 */
'use strict';

import Prefab from './scripts/Prefab.js'
import PrefabLibrary from './scripts/PrefabLibrary.js'

const DEBUG = true;

// Editor
class Editor {

    #userid;

    constructor( userid = 'test') {

        this.#userid = 'shenshaw'; // put your username here

        // initialize some stuff here
        this.levelList = this.fetchLevelList();
        this.obstacleCount = 0;

        //this.populateLibraryObjects();
        this.objectLib = new PrefabLibrary( $('#object-list'));
        this.objectLib.fetch( this.#userid );
        $(".object-list").on('click', event => this.onEditPrefab( event ));

        // initialize the drag and drop stuff
        this.onDrop( $('#edit-window'));

        //  handle the save action from the user
        $("#info-form").on('submit', event => this.onSave( event ))
        $('#save-level').on('click', event => this.onSave( event ));

        $("#object-form").on('submit', event => alert("Pop a new prefab dialog here"));
        $('#new-prefab').on('click', event => alert("Pop a new prefab dialog here"));
        $('body').on('keypressed', event => { this._lastKey = event.key })

        //  Debugging aids
        if (DEBUG) {
            $('.editor').on('mousemove', event => {

                this.writeInfo(`Mouse offset at (${event.offsetX},${event.offsetY})`);
            })
        }
    }


    run() {
        // TODO: do something here
    }

    // STD naming convention
    // .populate methods fill in class data and private class data from paramters
    // .fetch methods make async calls to a server to retrieve class data
    // .fetch often calls .populate

    fetchLevelList() {

        let $list = $('#level-list');
        $list.html("");
        $.post(`/api/get_level_list/${this.#userid}`, { userid: this.#userid })
            .then( resultString => JSON.parse( resultString ))
            .then( result => result.payload )
            .then( levelList => {

                levelList.forEach(( level, index )=> {

                    let $opt = $(`<option value="${index}">${level}</option>`);
                    $list.append( $opt )
                })
            })
            .catch( error => console.log( error ))
    }

    onDrop( $dropArea ) {
        // manage the drop zone
        $dropArea
            .on('dragenter', event => {})
            .on('dragover',  event => {
                event.preventDefault();
                let myCss = { 'cursor':'move' };
                $('.obstacle').css( myCss );
            })
            .on('dragleave', event => {})
            .on('drop',      event => {
                let dragInfo = this._getDraggableData( event );
                let $draggedEntity = $(dragInfo.id);

                let $obj = $draggedEntity;
                if (!$draggedEntity.hasClass("placed")) {
                    // When a draggable thing is dropped here, create a new div inside
                    $obj = $(`<div id="obstacle-${this.obstacleCount++}" class="obstacle placed" draggable="true"></div>`);
                    $('#edit-window').append( $obj );

                    let obstacleCount = Math.floor( $('input[name=obstacles]').val() ) + 1;
                    $('input[name=obstacles]').val( obstacleCount );

                    //this.addDragHandlers( $obj );
                    Prefab.RegisterDraggable( $obj )
                }

                $obj.css({
                    'opacity':'1.0',
                    'height': $draggedEntity.height(),
                    'width':$draggedEntity.width(),
                    'background-image':$draggedEntity.css('background-image')
                });
                $obj.offset({ left: event.clientX - dragInfo.dx, top:  event.clientY - dragInfo.dy });
            });
    }

    onSave( event ) {
        // Grab the form data
        event.preventDefault();
        const formData = $('#info-form').serializeArray();

        // create a level object
        const theLevel = {};
        for (let attrib of formData) {
            theLevel[attrib.name] = attrib.value;
        }

        // create a list of collidables and add to the level
        theLevel.collidables = [];
        let $divList = $('#edit-window').children(".obstacle");
        $divList.each( ( index, el ) => {
            let collidableItem = {
                top: parseInt( el.style.top ),
                left: parseInt( el.style.left ),
                height: parseInt( el.clientHeight ),
                width: parseInt( el.clientWidth ),
            };
            theLevel.collidables.push( collidableItem );
        });

        // create the object to send to the server
        let payload = {
            userid: this.#userid,
            name: theLevel.name,
            type: 'level',
            payload: JSON.stringify( theLevel ),
        }

        // post the parameter object to the server to save
        $.post(`/api/save/${this.#userid}`, payload )
            .then( resultString => JSON.parse( resultString ))
            .then( result => alert(`Level data saved ${result.bytes} to: ${result.name}`))
            .catch( error => alert(`Error: ${error} - Something went wrong`))
    }

    onEditPrefab( event ) {
        // grab the thing clicked, look it up in the library
        const id = $( event.target.parentElement ).attr('value');
        const editable = this.objectLib.at( id );

        // pull the library data, update the form
        this._populatePrefabForm( editable );

        // TODO: enable the edit buttons
    }

    showFeedback( theContent ) {

        let markup = `<div id="hello">${theContent}</div>`;
        $('.feedback').html( markup );
    }

    writeInfo( msg ) {
        // TODO?: look at last two characters for \n ???
        const append = msg.startsWith("\a");
        this.log( msg, $("#info-window"), append )
    }

    writeStatus( msg ) {

        const append = msg.startsWith("\a");
        this.log( msg, $("#status-window"), append )
    }

    log( msg, $view, append ) {

        let info = '';
        if (append)
            info = $view.html();

        info += msg;
        $view.html( info )
    }

    saveLevel() {
        /*
        * @param: action=save
        * @param: appid=username
        * @param: name=filename
        * @param: datatype='object|level'
        * @param: payload=JSONString
        */
        let param = this.__genParams( 'save', 'testFile', 'level');
        param.payload = 'someString';

        //$.ajax({
        //    url:'http://pgwm.vfs.local/APE/server/save/',
        //    headers: {'Access-Control-Allow-Origin': 'htt://site allowed to access'},
        //    data: $.param( command )
        //})
        $.post("/api/save/", $.param( command ))
            .then( ( data ) => {
                let result = $.parseJSON( data );
            });

        this.showFeedback("The level was saved.");
    }

    _getDraggableData( event ) {

        let dragData = event.originalEvent.dataTransfer.getData("text/plain");
        return JSON.parse( dragData );
    }

    _populatePrefabForm( prefab ) {

        const $form = $('#object-form');
        $.each( prefab.data, ( key, value ) => {

            let $input = $form.find(`input[name=${key}]`);
            if ($input.length > 0) {
                $input.val( value );
            }
        });

        // $("#info-form input[name='name']").value = prefab.data.name;
        // $("#info-form input[name='height']").value = prefab.data.height;
        // $("#info-form input[name='width']").value = prefab.data.width;
        // $("#info-form input[name='texture']").value = prefab.data.texture;
        // $("#info-form input[name='mass']").value = prefab.data.mass;
        // $("#info-form input[name='bounce']").value = prefab.data.bounce;
        // $("#info-form input[name='friction']").value = prefab.data.friction;
        // $("#info-form input[name='hit-points']").value = prefab.data.hitPoints;
    }
}

// Main
main => new Editor();

