/*
Node Express Server (MEVN Stack)
Copyright (c) 2019-2020. Scott Henshaw, Kibble Online Inc. All Rights Reserved.
*/
'use strict';

import CORS from 'cors'

export default class CrossOriginConfig {

    cors( req, res, next ) {
        CORS({
            'allowedHeaders':['Content-Type'],
            'allowedMethods':['GET, POST, OPTIONS'],
            'origin':'*',
            'preflightContinue': true,
        });
        next()
    }

    header( req, respnse, next ) {
        //  Middleware
        // reqs send and options req first, this is the res
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-reqed-With');
        res.sendStatus( 200 );
        next()
    }
}
