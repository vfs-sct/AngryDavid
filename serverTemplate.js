/*
Node Express Server (MEVN Stack)
Copyright (c) 2019. Scott Henshaw, Kibble Online Inc. All Rights Reserved.

NOTE: package.json should have "type": "module" to enable ES6 modules

*/
'use strict';

import { fileURLToPath } from 'url'
import Path, { dirname } from 'path'
import FileSystem from 'fs-extra'  // supports promses

const __filename = fileURLToPath( import.meta.url );
const __dirname = Path.resolve();

import Express from 'express'
import HTTP from 'http'
import CORS from 'cors'

import Payload from './server/Result.js'
import LevelAPI from './server/LevelAPI.js'

const PORT = 4000;

class Server {

    constructor( api, port = PORT ) {

        // this.api = (this.api === undefined ? api : Express());
        this.api = Express();
        this.router = Express.Router();
        this.port = port;
        this.title = "Angry Pigs";

        let corsOptions = {
            'allowedHeaders':['Content-Type'],
            'allowedMethods':['GET, POST, OPTIONS'],
            'origin':'*',
            'preflightContinue': true,
        }

        this.api
            .use( Express.json() )
            .use( Express.urlencoded({ extended: false }))
            .use('/common', Express.static(`${Path.join(__dirname,'/common')}`))
            .use('/editor', Express.static(`${Path.join(__dirname,'/editor')}`))
            .use( CORS( corsOptions )).options('/*', this.#corsHandler )
            .use('/api/level', LevelAPI );

        // GET the editor page
        this.api.get('/editor', ( request, response ) => {
            response.sendFile(`${Path.join(__dirname, './')}/editor/index.html`, { title: this.title });
        });

        // GET index page
        this.api.get('/', ( request, response ) => {
            response.sendFile(`${Path.join(__dirname, './')}/game/index.html`, { title: this.title });
        });

        this.run();
    }

    #corsHandler( request, response ) {
        // CORS Requests send and options request first, this is the response
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        response.sendStatus( 200 );
    }

    #dataPath( userid ) {
        return `${Path.dirname( FileSystem.realpathSync(__filename))}/data/${userid}`
    }

    #handleListenerError( error ) {
        /**
         * Listen on provided port, on all network interfaces.
        */
        if (error.syscall !== 'listen')
            throw error;

        // handle specific listen errors with friendly messages
        let bind = typeof this.port === `string`?`Pipe ${this.port}`:`Port ${this.port}`;
        switch (error.code) {

            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit (1 );
                break;

            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;

            default:
                throw error;
        }
    }

    #handleListenerListening() {

        let addr = this.listener.address();
        let bind = typeof addr === `string`?`pipe ${addr}`:`port ${addr.port}`;
        console.log(`Listening on ${bind}`);
    }

    run() {
        // Create HTTP server.
        this.api.set('port', this.port );

        this.listener = HTTP.createServer( this.api );
        this.listener.listen( PORT );

        this.listener.on('error', error => this.#handleListenerError( error ));
        this.listener.on('listening', event => this.#handleListenerListening( event ))
    }
}

const server = new Server();
