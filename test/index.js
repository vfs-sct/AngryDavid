/**
 * @name Angry Pigs Server Test Application
 * @copyright: 2018, Kibble Games Inc, in cooperation with VFS.  All Rights Reserved.
 */
'use strict';

//import { HTTP } from './lib/http.js';  // If we dont have jQuery

class Test {

    constructor() {

        $('#test-object-input').on('submit', ( event ) => {
            event.preventDefault();

            let formDataList = $(event.target).serializeArray();
            let formData = {};
            formDataList.forEach( ( item ) => {
                formData[item.name] = item.value;
            });

            // JQuery way
            let request = {
                appid:    'shenshaw',
                name:     'object-1',
                type:     'object',
                payload:  JSON.stringify( formData )
            };

            // chained promises
            //$.post('http://pgwm.vfs.local/ape/server/save_object/', request )
            $.post('server/save_object/', request )
                .then( data => { 
                    return $.parseJSON( data ) 
                })
                .then( result => { 
                    this.myShowResult( result ) 
                });

            // ES2017 async/await way - requires $.post to return a Promise object
            /*
            let response = await $.post('server/save/', request );
            let result = $.parseJSON( response );
            this.my_showResult( result );
            */

            // Future way...
            /*
            let response = fetch('server/save/', request )
                .then( response => { return $.parseJSON( response ) })
                .then( result => { this.myShowResult( result ) })
            */
        });

        $('#test-level-input').on('submit', ( event ) =>{
            event.preventDefault();
        
            let data = { // Note the data is the level payload to send to a server.
                id:             0,
                name:           "level-1",
                projectiles:    15,
                firstStar:      500,
                secondStar:     1000,
                thirdStar:      1500,
                cannon:         {
                    world_x:  75,
                    world_y:  92
                },
                entities:       {
                    birds:      [],
                    collidables:[]
                }
            };
        
            let request = {
                appid:    'shenshaw',
                name:     'level-1',
                type: 'level',
                payload:  data,
            };
        
            //$.post('http://pgwm.vfs.local/ape/server/save/', request )
            $.post('server/save/', request )
                .then( ( data ) => {
    
                    let result = $.parseJSON( data );
                    this.myShowResult( result );
                });
        });
    }

    myShowResult( result ) {

		// compose the view markup based on JSON data we recieved
        let markup = "JSON: " + result;

        // Display the markup in the result section
        console.log( markup );

        // Pop an alert to let the user know that the result is computed
        alert("Form submitted successfully.\nReturned json: " + result);
    }
    run() {

    }
}

// MAIN Entrypoint.
$(document).ready( ( event ) => {

    let test = new Test();
    test.run();
});
