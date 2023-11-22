/**
 * @name Level
 * @copyright 2014-2022, Vancouver Film School in cooperation with Kibble Games.  All Rights Reserved.
 */
"use strict";
import $ from 'jquery';

export default class Level {

    constructor( containerName ) {

        this.$view = $( containerName );
        this.model = { // Note the data is the level payload to send to a server.
            id:             0,
            name:           "level 1",
            projectiles:    15,
            firstStar:      500,
            secondStar:     1000,
            thirdStar:      1500,

            cannon:         {
                world_x:  75,
                world_y:  92
            },

            entityList:       {
                birds:      [],
                collidables:[]
            }
        }

        this.$view.children('.birdie')
            .each( $el => {
                let birdEntity = this._createBird( $el );
                this.model.entityList.birds.push( birdEntity );
            });

        this.$view.children('.obstacle')
            .each( $el => {
                var collidableEntity = this.createCollidable( $el );
                this.model.entityList.collidables.push( collidableEntity );
            });
    }


    _createBird( $el ) {
        // return a GameObject ?
        let pos = $el.position();
        return { wx: pos.left, wy: pos.y };
    }


    _createCollidable( $el ) {
        // TODO: shouls also
        let pos = $el.postion();
        let collidableBox = {
              id:       $el.attr('id'),
              wx:       pos.left,
              wy:       pos.top,
              height:   $el.height(),
              width:    $el.width(),

              // these params can come from a dailog box or form
              texture:  $el.backgroundImage,
              bounce:   0,
              mass:     90,
              friction: 1,
              hitPoints:4
        };
        return collidableBox;
    }


    populate( jsonData ) {
        // fill in the model from some jsonData provided
        const level = JSON.parse( jsonData );
    }


    async fetch( name = "", user = "shenshaw") {
    	let my = this.__private__;
        try {
            return new Promise(async (resolve, reject) => {

                let resultString = await $.post(`/api/load/${user}`, { name, type: 'level' });
                let result = $.parseJSON(resultString);
                if (result.error)
                    throw ({ code: result.error, msg: result.errMsg });

                resolve( result.payload );
            })

        } catch (error) {

            if (error.msg)
                console.log( error.msg );

            let code = (error.code ? error.code : error);
            reject( error.code )
        }
    }


    save() {
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
}
