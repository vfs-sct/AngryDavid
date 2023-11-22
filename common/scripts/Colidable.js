/**
 * APE Collidable
 *
 * @copyright: (C) 2018 Kibble Games Inc in cooperation with Vancouver Film School.  All Rights Reserved.
 * @author:    Scott Henshaw {@link mailto:shenshaw@vfs.com}
 * @version:   1.0.0
 *
 * @summary:   Framework Singleton Class to contain a web app
 *
 */
'use strict';

class Colidable {

    constructor(anElement = null) {

        this.data = {
            id: 0,
            sx: parseInt(anElement.top),
            sy: 225,
            height: 70,
            width: 70,
            texture: "images/metalBox.png",
            bounce: 0,
            mass: 90,
            friction: 1,
            shape: "square"
        };
    }

    populate(someObject) {
        this.data.id = someObject.id;
        this.data.sx = someObject.sx;
        this.data.sy = someObject.sy;
        this.data.height = someObject..height;
        this.data.width = someObject.width;
        this.data.texture = someObject.texture;
        this.data.bounce = someObject.bounce;
        this.data.mass = someObject.mass;
        this.data.friction = someObject.friction;
        this.data.shape = someObject.shape;
    }


    set topLeft(position = { sx: 0, sy: 0 }) {
        // call as ...
        // let a = new Collidable( someDiv );
        // a.topLeft = { sx: 123, sy: 134 };

        this.data.sx = position.sx;
        this.data.sy = position.sy;
    }

    // TODO: more set methods
    serialize() {

        return JSON.stringify( this.data );
    }
}