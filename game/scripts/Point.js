/*
 * Point Controller Prototype
 *
 *   Manage RigidBodies in a box2D world
 *
 * 		suffixes _el are jQuery DOM elements to be controlled
 * 		suffixes _mdl are Box2D model elements to be controlled
 *
 *
 *
 * Copyright 2014-2017, Kibble Games.  All Rights Reserved.
 */
'use strict';

import Physics from '/common/libs/Physics.js';

const SCREEN = { HEIGHT: 720, WIDTH: 1280 }
const HALF = { HEIGHT: SCREEN.HEGHT / 2, WIDTH: SCREEN.WIDTH / 2 }


export default class Point {
    // Store x, y in world coordinates in screen coordinates
    constructor( x = 0, y = 0 ) {

    	this._dx = x;
        this._dy = y;
    }

    get x() { return this._dx; }
    get y() { return this._dy; }

    asVec2( orig = { left: HALF.WIDTH, top: HALF.HEIGHT }) {
        // World origin is at center, X -> right, Y -> up
        // shift to world origin
        return new Physics.Vec2({
            x: Math.floor( this._dx * Physics.SCALE ) - orig.left,
            y: orig.top - Math.floor( this._dy * Physics.SCALE ),
        });
    }

    fromScreen( pos = {}, orig = { left: HALF.WIDTH, top: HALF.HEIGHT } ) {

        // if pos is x, y or doesn't have top, left then its not screen coords
        if ((pos.left === undefined) || (pos.top === undefined))
            return;

        this._dx = (pos.left - orig.left) / Physics.SCALE;
        this._dy = (orig.top - pos.top) / Physics.SCALE;

        return { x: this._dx, y: this._dy }
    }
}
