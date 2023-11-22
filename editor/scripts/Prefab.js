/**
 * App MAIN
 * Copyright (C) 2018-2020 Scott Henshaw, All rights Reserved
 */
'use strict';

const TEXTURE_ROOT = "/common/images";

export default class Prefab {

    constructor( jsonData ) {

        this.__data__ = {
            name:"Unknown",
            height:"70",
            width:"70",
            texture:`${TEXTURE_ROOT}/vfs_logo.png`,
            mass:"90",
            bounce:"0",
            friction:"1",
            hitPoints:"4"
        }
        this.transform = {};
        this.offset = { left: 0, top: 0 };
        this.id = undefined;

        this.populate( jsonData )
    }

    get data() { return this.__data__ }

    get coords() {
        return {
            left: this.location.left - this.offset.left,
            top: this.location.top - this.offset.top
        }
    }


    offset( x = 0, y = 0) {
        this.offset = {
            left: x,
            top: y
        }
        return this
    }


    transform( element ) {
        this.transform = element.getBoundingClientRect()
        return this
    }


    markup( htmlId = this.id, imageRoot = TEXTURE_ROOT ) {
        let my = this.__data__;
        let css = `
            height: ${my.height}px;
            width: ${my.width}px;
            background-image: url(${imageRoot}/${my.texture})
        `;

        if (htmlId === undefined)
            htmlId = this.generateId( my.name )

        let markup = `<div id="${htmlId}" class="obstacle" style="${css}" draggable="true"></div>`;
        return markup;
    }


    generateId( name = this.__data__.name ) { return name.toLowerCase().replace(" ","-") }


    populate( sourceData ) {
        // source can be either a string (JSON) or an object
        if (sourceData === undefined)
            return this;

        let newData = sourceData;
        switch (typeof sourceData) {
            case 'string':
                newData = JSON.parse( sourceData );
                break;

            case 'object':
                newData = sourceData;
                    break;

            default:
                newData = {};
                break;
        }

        // This prunes any prefix baked into the data, leaves just the image name
        // assumes that the images are in TEXTURE_ROOT
        let imgNameParts = newData.texture.split("/");
        newData.texture = imgNameParts[imgNameParts.length-1];

        // merge newData into this objects __data__
        this.__data__ = { ...this.__data__, ...newData };
        this.id = this.generateId();

        return this
    }


    fetch( name, userid ) {
        // gets just one item from the library, then returns it on resolve
        return new Promise( ( resolve, reject ) => {

            $.post(`/api/load/${userid}`, { name, type:"object" })
                .then( resultString => JSON.parse( resultString ))
                .then( result => (result.error ? reject( result ) : result.payload))
                .then( jsonData => JSON.parse( jsonData ))
                .then( entity => {

                    this.populate( entity );
                    resolve( this )
                })
                .catch( error => reject( error ))
        })
    }


    static RegisterDraggable( $element ) {
        $element
            .on('dragstart', event => {
                 let dragData = {
                    dx: event.offsetX,
                    dy: event.offsetY,
                    id: `#${event.target.id}`,
                    boundingRect: event.target.getBoundingClientRect(),
                    texture: `${event.target.style.backgroundImage}`
                }
                event.originalEvent.dataTransfer.setData("text/plain", JSON.stringify( dragData ));
                $(event.target).css("opacity","0.4");
            })
            .on('drag',      event => {
                $('#status-window').html(`
                    Client: ${event.clientX},  ${event.clientY}<br />
                    Offset: ${event.offsetX }, ${event.offsetY}<br />
                    Page:   ${event.pageX},    ${event.pageY}<br />
                    <br />
                    $ Position: ${$(event.target).position().left}, ${$(event.target).position().top}<br />
                    $ Offset:   ${$(event.target).offset().left}, ${$(event.target).offset().top}<br />
                `)
            })
            .on('dragend',   event => $(event.target).css("opacity","1.0"));

        return this
    }


    fetchAsync( name ) {
        // gets just one item from the library, then returns it on resolve
        return new Promise( async ( resolve, reject ) => {

            const resultString = await $.post(`/api/load/${this.userid}`, { name, type:"object" })
                .catch( error => reject( error ));

            const result = JSON.parse( resultString );
            if (result.error)
                reject( result );

            const entity = JSON.parse( result.payload );

            this.populate( entity );
            resolve( this )
        })
    }


    serialize() {
        return JSON.stringify( this.__data__ )
    }
}