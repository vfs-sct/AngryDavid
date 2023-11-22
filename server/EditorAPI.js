/*
Node Express Server Route Module for a Level Save/LOad (MEVN Stack)
Copyright (c) 2019. Scott Henshaw, Kibble Online Inc. All Rights Reserved.
*/
'use strict';

import Express from 'express'
const Router = Express.Router();

import Path from 'path'

Router.get('/editor', ( req, res, next ) => {
    // GET the editor page
    console.log("fetching editor");
    res.sendFile(`${Path.join(__dirname, './')}/editor/index.html`, { title: this.title });
    next()
});

export default Router;