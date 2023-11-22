/**
 * @name: Cannon Controller
 * @Copyright 2014-2022, VFS & Kibble Games Inc.  All Rights Reserved.
 */
'use strict';

import Pig from './Pig.js';

export default class Cannon {

    constructor( x, y, angle = 20 ) {
        // Cannon controller
        let my = this.__private__ = {

            position: { x, y },
            gun: { x: 0, y: -150 },
            angle,
            strength: 60,
            ammo: 100,

            // TODO: decouple this from the game controller
            projectile: {},  // projectile controller
            index: -1,
        }

        this.$view = $(`
            <div id="cannon" class="entity cannon-container">
                <div class="cannon cannon-bottom"></div>
                <div id="cannon-top" class="entity cannon cannon-top"></div>
            </div>
        `)
    }

    static get KEY() {
        return {
            UP:   38,
            DOWN: 40,
            W:    119,
            S:    115,
        }
    }
    set ammo( value ) { this.__private__.ammo = (value > 0 ? value : 1) }


    aim( char ) {
        // access my private variables
        const my = this.__private__; // alias

        switch (char.charCodeAt()) {

            case Cannon.KEY.UP: // Up Arrow Key
            case Cannon.KEY.W:
                my.angle++;
                if (my.angle > 90)
                    my.angle = 90;
                break;

            case Cannon.KEY.DOWN: // Down arrow key
            case Cannon.KEY.S:
                my.angle--;
                if (my.angle < 0)
                    my.angle = 0;
                break;

            default:
                break;
        }
    }


    fire( world, entityList ) {
        // access my private variables
        const my = this.__private__;

        if (my.index > 0) {
            // Remove old pig from view
            $('#piggie').remove();

            // now remove the old pig from the world
            my.projectile.remove();

            entityList.splice( my.index, 1 );
            my.index = -1;
        }

        const $pig = $('<div id="piggie" class="entity projectile"></div>');
        const loc = {
            x: Math.floor(this.$view.position().left + (this.$view.width() / 2)),
            y: Math.floor(this.$view.position().top + (this.$view.height() / 2) + (my.gun.y / 2))
        };
        $('#game-area').append( $pig );
        $pig.css({'transform':`translate(${loc.x}px, ${loc.y}px)`});

        // Create a projectile (TODO: Need to reset this to null to delete the pig entity
        my.index = entityList.length;
        my.projectile = new Pig( world, $pig );

        entityList[my.index] = my.projectile;

        //Give it a shove (angle and power)
        my.projectile.applyImpulse(-1 * my.angle, 2500); // Angle (degrees), power
    }


    render() {
        // access my private variables
        const my = this.__private__;

        let translation = `translate(${my.position.x}px, ${my.position.y}px)`;
        this.$view.css({'transform':`${translation}`});

        // Trap and adjust cannon angle.
        // Adjusted for the inherant angle built into the art (40 deg) sam as default in model
        //let r = -1 * my.cannonAngle + 30;
        translation = `translate(${my.gun.x}px, ${my.gun.y}px)`;
        const rotation = `rotate(${-1 * my.angle + 20}deg)`;
        $('#cannon-top').css({'transform':`${translation} ${rotation}`});
    }


    update( dt ) {

    }
}
