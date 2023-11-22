/**
 * @name: Bird Controller Prototype
 * @Copyright 2014-2022, VFS & Kibble Games Inc.  All Rights Reserved.
 */
'use strict';

import GameObject from './GameObject.js';

export default class Bird extends GameObject {

    constructor( aWorld, $element, isStatic ) {

    	super( aWorld, $element, isStatic );
    	this.$view.css({'transform-origin' : '25% 25%'})
    }


    create( x, y, width, height ) {

        let body_defn = super.rigidBody( x, y );
        let fix_defn = super.shapeFixture( height, width, 0.002, 0.5, 0.3, GameObject.SHAPE.CIRCLE );
        let model = super.createModel( body_defn, fix_defn );

        return model;
    }


    update() {

        //Give it a shove (angle and power)
        this.applyImpulse( -90, 2 );  // Angle (degrees), power
    }
}
