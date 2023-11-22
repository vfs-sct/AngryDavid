/*
Node Express Server (MEVN Stack)
Copyright (c) 2019-2020. Scott Henshaw, Kibble Online Inc. All Rights Reserved.
*/
'use strict';

import { fileURLToPath } from 'url'
import Path, { dirname } from 'path'
import FileSystem from 'fs-extra'  // supports promses

const __filename = fileURLToPath( import.meta.url );
const __dirname = Path.resolve();

import Express from 'express'
import HTTP from 'http'

import CrossOriginConfig from './server/corsConfig.js';
import AppAPI from './server/AppAPI.js';
import LevelAPI from './server/LevelAPI.js';

const PORT = 4000;


// Simplify this...
class Server {

    constructor( api, port = PORT ) {

        this.api = Express();
        this.router = Express.Router();
        this.port = port;
        this.title = "Angry Pigs";

        let crossOrigin = new CrossOriginConfig();

        this.api
            .use( crossOrigin.cors ).options('/*', crossOrigin.header )
            .use( Express.json() )
            .use( Express.urlencoded({ extended: false }))
            .use('/', Express.static(`${Path.join(__dirname,'/game')}`))
            .use('/common', Express.static(`${Path.join(__dirname,'/common')}`))
            .use('/editor', Express.static(`${Path.join(__dirname,'/editor')}`))
            .use('/api', LevelAPI );
            // append your APIs here

        this.api.get('/test', ( req, res ) => {
            // GET the editor page
            console.log("fetching editor");
            const indexFile = `${Path.join(__dirname, '/test/')}index.html`;
            res.sendFile( indexFile )
        });

        // this.api.get('/editor', ( req, res ) => {
        //     // GET the editor page
        //     console.log("fetching editor");
        //     const indexFile = `${Path.join(__dirname, '/editor/')}index.html`;
        //     res.sendFile( indexFile )
        // });

        this.api.get('/', ( req, res ) => {
            // GET index page
            console.log("fetching index");
            const indexFile = `${Path.join(__dirname, '/game/')}index.html`;
            res.sendFile( indexFile )
        })

        this.run()
    }

    dataPath( userid ) {

        return `${Path.dirname( FileSystem.realpathSync(__filename))}/data/${userid}`
    }

    handleListenerError( error ) {
        // Listen on provided port, on all network interfaces
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

    handleListenerListening() {

        let addr = this.listener.address();
        let bind = typeof addr === `string`?`pipe ${addr}`:`port ${addr.port}`;
        console.log(`Listening on ${bind}`)
    }

    run() {
        // Create HTTP server.
        this.api.set('port', this.port );

        this.listener = HTTP.createServer( this.api );
        this.listener.listen( PORT );

        this.listener.on('error', error => this.handleListenerError( error ));
        this.listener.on('listening', () => this.handleListenerListening())
    }
}

const server = new Server()
