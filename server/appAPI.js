/*
Node Express Server Route Module for a Level Save/LOad (MEVN Stack)
Copyright (c) 2019. Scott Henshaw, Kibble Online Inc. All Rights Reserved.
*/
'use strict';

import Express from 'express'
const Router = Express.Router();

import Path from 'path'

Router.get('/', ( req, res, next ) => {
    // GET index page
    console.log("fetching index");
    let indexFile = `${Path.join(__dirname, './')}/app/index.html`;
    res.sendFile( indexFile, { title: this.title });
    next()
})

export default Router