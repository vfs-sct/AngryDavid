/**
 * AJAX Via XMLHttpRequest without jQuery
 *
 * @copyright: (C) 2016 Vancouver Film School - All Rights Reserved.
 * @author: Scott Henshaw
 * @version: 0.1
 *
 * @summary: Framework Singleton Class to contain a web app
 * @description: A-> $http function is implemented in order to follow the standard Adapter pattern
 * based on the work pulished by Mozilla at
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
 *
 * @usage:
 *
    // Executes the method call

    http.post( "server/", {'action': 'some_command', 'data':'somePromiseData'} )
        .then( ( data ) => {
            console.log(1, 'success', JSON.parse( data ));
        });

    // Executes the method call but an alternative way (2) to handle Promise Reject case

    http.post( "server/", {'action': 'some_command', 'data':'somePromiseData'}  )
        .then( ( data ) => {
            console.log(1, 'success', JSON.parse( data ));
        })
        .then( undefined, ( data ) => {
            console.log(2, 'error', JSON.parse(data));
        });

*
*/
'use strict';

// Lets make this ES6 class functional, and make it's API
// very similar to the jQuery and Angular versions.
class HTTPHandler {

    // Method that performs the ajax request
    _ajax( method, url, args ) {

        // Creating a promise (Promise objects are inherant in ES6)
        let promise = new Promise( ( resolve, reject ) => {

            // Instantiates the XMLHttpRequest
            let client = new XMLHttpRequest();
            let uri = url;

            if (args && (method === 'POST' || method === 'PUT')) {
                uri += '?';
                let argcount = 0;
                for (let key in args) {
                    if (args.hasOwnProperty( key )) {
                        if (argcount++) {
                            uri += '&';
                        }
                        uri += encodeURIComponent( key ) + '=' + encodeURIComponent( args[key] );
                    }
                }
            }

            client.open( method, uri );
            client.send();

            // Sucess callback
            client.onload = function() {

                if (this.status >= 200 && this.status < 300) {
                    // Performs the function "resolve" when this.status is equal to 2xx
                    resolve( this.response );

                } else {
                    // Performs the function "reject" when this.status is different than 2xx
                    reject( this.statusText );
                }
            };

            // Rejection callback
            client.onerror = function() {
                reject( this.statusText );
            };
        });

        // Return the promise
        return promise;
    }

    // Adapter pattern, these all return a promise object.
    get( url, args )  { return this._ajax('GET', url, args ); }
    post( url, args ) { return this._ajax('POST', url, args ); }
    put( url, args )  { return this._ajax('PUT', url, args ); }
    del( url, args )  { return this._ajax('DELETE', url, args ); }

} // End A

const HTTP = new HTTPHandler();
export default HTTP;




