/*
 * GameObject Controller Class
 * @copyright 2014-2022, VFS.  All Rights Reserved.
 */
'use strict';

// import $ from '/common/libs/jquery-3.6.0.min.js';
import Physics from '/common/libs/Physics.js';

export default class GameObject {

    constructor( worldModel, $element, isStatic ) {	 // remove dom (we'll create it, add data

    	// this is our world controller, the one we are a part of
    	if (worldModel === undefined)
    		return -1;

    	// this is our dom element to manage
    	if ($element === undefined)
    		return -1;

    	// some local and constructor stuff here
        let my = this.__private__ = {
            left:      0,
            top:      0,
            width:  0,
            height: 0
        };

        this.initialized = false;

    	this.world       = null;  // Our World manager
    	this.$view       = null;  // The jQuery DOM element se have selected "actors"
    	this.model       = null;  // The Box2D Rigid Body "model" we are managing

    	this.damage = 1;
    	this.world = worldModel;
    	this.$view = $element;

    	// Model origin is C.O.M of object, DOM origin is left,top adjust w,h
    	let screenPos = this.$view.position();

    	my.width = this.$view.width() / 2 ;
    	my.height = this.$view.height() / 2;

    	my.left = (Math.floor( screenPos.left )) + my.width;
    	my.top = (Math.floor( screenPos.top ) - my.height);

    	this.model = this.create( my.left, my.top, my.width, my.height, isStatic );

    	this.model.m_userData = {
    	    $element: this.$view,
    	    width:    my.width,
    	    height:   my.height
    	};

    	//Reset DOM object position for use with CSS3 positioning
    	this.$view.css( {'left':'0px', 'top':'0px'} );
    	this.initialized = true;
    }

    static get SHAPE() { return { CIRCLE: 0, BOX: 1 }}

    applyImpulse( degrees, power ) {

    	if (!this.initialized)
    		return;

    	let angle = degrees * Physics.DEG_2_RAD;
        let impulse_vector = new Physics.Vec2( Math.cos( angle ) * power, Math.sin( angle ) * power );
        let center_vector = this.model.GetWorldCenter();

        this.model.ApplyImpulse( impulse_vector, center_vector );
    }

    applyForce( degrees, power ) {

    	if (!this.initialized)
    		return;

    	let angle = degrees * Physics.DEG_2_RAD;
        let force_vector = new Physics.Vec2( Math.cos( angle ) * power, Math.sin( angle ) * power );
        let center_vector = this.model.GetWorldCenter();

        this.model.ApplyForce( force_vector, center_vector );
    }

    setDensity( density ) {

    	if (!this.initialized)
    		return;

        let my_fixture = this.model.GetFixtureList();
        my_fixture.SetDensity( density );
    }

    remove() {
        // Remove this entity from the world

    	if (!this.initialized)
    		return;

    	this.model.SetUserData( null );
    	this.world.model.DestroyBody( this.model );
    	this.model = null;
    }

    update( opts = undefined ) {
        // Update this object based on supplied position/rotation data
    	if (opts === 'undefined')
    		return;

		let x = opts.x;
		let y = opts.y;

		//Retrieve positions and rotations from the Box2d world
	    this.model.m_xf.position.x = (x / Physics.WORLD_SCALE) + this.model.m_userData.width;
	    this.model.m_xf.position.y = (y / Physics.WORLD_SCALE) + this.model.m_userData.height;
    }

    render( debug = false ) {
        // Draw/move this objects element based on its position

    	if (!this.initialized)
    		return;

    	//Retrieve positions and rotations from the Box2d world
        let x = Math.floor((this.model.m_xf.position.x * Physics.WORLD_SCALE) - this.model.m_userData.width);
        let y = Math.floor((this.model.m_xf.position.y * Physics.WORLD_SCALE) - this.model.m_userData.height);

        // kinda dropped the rotation, hmmm.

        //CSS3 transform does not like negative values or infitate decimals
        let r = Math.round( ((this.model.m_sweep.a + Physics.TWO_PI) % Physics.TWO_PI) * Physics.RAD_2_DEG * 100 ) / 100;
        let css = {'transform':`translate(${x}px,${y}px) rotate(${r}deg)`};
        this.$view.css( css );

        if (debug) {
        	this.$view.addClass( "debug" );
        }
    }

    setModel( data, isStatic = false ) {
        /* Build a model data structure...
        {
            "id":0,
            "wx":471,
            "wy":225,
            "height":70,
            "width":70,
            "texture":"images/metalBox.png",
            "bounce":0,
            "mass":90,
            "friction":1,
            "hitPoints":4
          },
        */
        this.damage = data.hitPoints;
        let body_defn = this.createBody( data.wx, data,wy, isStatic );
        let fix_defn = this.shapeFixture( data.height, data.weight, data.mass, data.friction, data.bounce );
        let model = this.createModel( body_defn, fix_defn );

        return model;
    }

    rigidBody( left, top, isStatic = false ) {

        let defn = new Physics.BodyDef;
        defn.type = Physics.Body.b2_dynamicBody;
        if (isStatic) {
            defn.type = Physics.Body.b2_staticBody;
        }

        defn.position.x = left / Physics.WORLD_SCALE;
        defn.position.y = top / Physics.WORLD_SCALE;

        return defn;
    }

    shapeFixture( height, width, density, friction, restitution, shape = SHAPE.BOX ) {

        // if its not a circle, its a box.
        let defn = new Physics.FixtureDef;

        defn.shape = new Physics.PolygonShape;
        defn.shape.SetAsBox( width / Physics.WORLD_SCALE, height / Physics.WORLD_SCALE);
        if (shape == GameObject.SHAPE.CIRCLE) {

            defn.shape = new Physics.CircleShape;
            defn.shape.m_p.Set( (width / 4)  /  Physics.WORLD_SCALE, (height / 4) / Physics.WORLD_SCALE );
            defn.shape.m_radius = ( width / 4 / Physics.WORLD_SCALE );
        }

        defn.density = density;          // density * area = mass
        defn.friction = Math.min( Math.max( 0, friction ), 1 );        // 1 = sticky, 0 = slippery
        defn.restitution = Math.min( Math.max( 0, restitution ), 1 );  // 1 = very bouncy, 0 = almost no bounce

        return defn;
    }

    createModel( bodyDefn, fixtureDefn ) {

        let model = this.world.model.CreateBody( bodyDefn );
        model.CreateFixture( fixtureDefn );

        return model;
    }

    create( left, top, width, height, isStatic ) {

        let body_defn = this.rigidBody( left, top, isStatic );
        let fix_defn = this.shapeFixture( height, width, 4.0, 0.7, 0.2, GameObject.SHAPE.BOX );
        let model = this.createModel( body_defn, fix_defn );

        return model;
    }
}
