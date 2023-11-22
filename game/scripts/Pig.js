/**
 * Pig Controller Prototype
 *
 *   The prime goal of this class is to manage the updates between Pig projeciles
 *   using the default Entity class
 *
 * Copyright 2014-2017, VFS.  All Rights Reserved.
 */
'use strict';

import GameObject from './GameObject.js';

export default class Pig extends GameObject {

    constructor( worldModel, $element, isStatic ) {

    	super( worldModel, $element, isStatic );

    	this.$view.css( {'transform-origin' : '25% 25%'} );
    	this.$view.addClass('debug');
    	this.$view.addClass('circle')
    }

    create( x, y, width, height ) {

        let body_defn = super.rigidBody( x, y );
        let fixture_defn = super.shapeFixture( height, width, 70, 2, 0.01, GameObject.SHAPE.CIRCLE );
        let model = super.createModel( body_defn, fixture_defn );
        return model;
    }
}
