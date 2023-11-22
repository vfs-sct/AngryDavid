/*
Node Express Server Route Module for a Level Save/LOad (MEVN Stack)
Copyright (c) 2019. Scott Henshaw, Kibble Online Inc. All Rights Reserved.
*/
'use strict';

import Express from 'express'
const Router = Express.Router();

import FileSystem from 'fs'

import Result from './Result.js'
import FileList from './FileList.js'

import LevelLoader from './LevelLoader.js'

// Parameters coming in...
    /*
    // If request was /api/level/?name=value then use .query to get PHP style data
    let value = request.query.name;

    // If request was /api/level:name then use .params to get data
    let value = request.params.name;

    // If request was /api/level with accompanying post JSON data use .body to get data
    let value = request.body.name;
    */

// API
Router.get('/', ( request, response ) => {

    let result = new Result();
    // result.data = someDataToSend
    result.ok();
    response.send( result.serialize() )
});


Router.post('/get_level_list/:userid?', ( request, response ) => {

    let result = new Result( 201, `Error: Missing list or list params` );
    let params = {
        ...request.params,  // optional stuff from the actual URI
        ...request.query,   // stuff from the query ?a=b&c=d&...
        ...request.body     // JSON data posted...
    }
    let loader = new FileList( params.userid );

    loader.fetch()
        .then( fileList => {
            // on success, pull together a real response with data (payload) and send it
            result.update( 0, "Error: OK", fileList );
            response.send( result.serialized() )
        })
        .catch( err => {
            // on error, simply return the error to the client
            response.send( result.serialized() )
        })
});

Router.post('/get_object_list/:userid?', ( request, response ) => {

    let result = new Result( 201, `Error: Missing list or list params` );
    let params = {
        ...request.params,  // optional stuff from the actual URI
        ...request.query,   // stuff from the query ?a=b&c=d&...
        ...request.body     // JSON data posted...
    }
    let loader = new FileList( params.userid, "/library" );

    loader.fetch()
        .then( fileList => {
            // on success, pull together a real response with data (payload) and send it
            result.update( 0, "Error: OK", fileList );
            response.send( result.serialized() )
        })
        .catch( err => {
            // on error, simply return the error to the client
            response.send( result.serialized() )
        })
});

Router.post('/load/:userid?', async ( request, response ) => {

    let result = new Result( 201, `Error: Cannot load folder or files` );
    let params = {
        ...request.params,  // optional stuff from the actual URI
        ...request.query,   // stuff from the query ?a=b&c=d&...
        ...request.body     // JSON data posted...
    }
    const loader = new LevelLoader( params.userid );
    const content = await loader.load( params.name, params.type )
        .catch( err => {
            // on error, simply return the error to the client
            // C:\Users\scott\VFS\Repos\apps\www\Express\AngryPigs\server\data\shenshaw\library
            result.update( 202,`Error: Missing/empty file ${err}` );
            response.send( result.serialized() );
            return
        });

    // on success, pull together a real response with data (payload) and send it
    result.update( 0, "Error: OK", content );
    response.send( result.serialized() )
});


Router.post('/save/:userid?', async ( request, response ) => {

    let result = new Result( 301, `Error: Cannot write folder or files ${err}` );
    let params = {
        ...request.params,  // optional stuff from the actual URI
        ...request.query,   // stuff from the query ?a=b&c=d&...
        ...request.body     // JSON data posted...
    }
    let loader = new LevelLoader( params.userid );
    const content = await loader.save( params.name, params.payload )
        .catch( err => {
            result.update( 302,`Error: Missing/empty file ${err}` );
            response.send( result.serialized() );
            return
        });

    result.update( 0, "Error: OK", content );
    response.send( result.serialized() )
});


export default Router;