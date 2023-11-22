/**
 * @name Angry Pigs
 * @copyright 2014-2022, Kibble Games Inc, in cooperation with VFS.  All Rights Reserved.
 */
'use strict';
import '/common/libs/jquery-3.6.0.min.js';

import GameObject from './scripts/GameObject.js';
import Point from './scripts/Point.js';
import World from './scripts/World.js';
import Bird from './scripts/Bird.js';

import Cannon from './scripts/Cannon.js';


const toInt = str => 1 * str;

// Game App
class Game {

    constructor() {
        // private variables
        let my = this.__private__ = {
            state: Game.STATE.SPLASH,
            $view: $('#game-area'),
            debug: true,

            // main controllers
            world: {}, // Keep a reference to the Controllers
            cannon: {},

            // collidable controllers
            targetList: [],
            entityList: [], // Empty list of all collidable obstacles (TODO: push into world)
            targetIndex: -1,

            levelName: "unknown",
        };

        my.state = this.#_initScreens();
        this.#_initGame() // async because of the level loading
            .then( state => {
                my.state = state;
                this.#_initDebug();
                this.run()
            })
    }


    // Public static states for the Game, i.e. Game.STATE.LOADING
    static get STATE() { return { SPLASH: 0, LOADING: 1, GAME: 2, RESULTS: 3}}


    update() {
        //Update the world positions
        const my = this.__private__; // alias

        if (my.state != Game.STATE.GAME)
            return;

        my.targetList.map( target => target.update() );

        // note we don't have to update each Entity as the rigid bodies that model them
        // are updated when the world updates.
        my.world.update();
        my.cannon.update();
    }


    render() {
        // Draw the Dom Objects
        const my = this.__private__; // alias

        if (my.state != Game.STATE.GAME)
            // still loading...
            // add a callback delay
            return;

        my.entityList.map( entity => entity.render( my.debug ));
        my.world.render();
        my.cannon.render()
    }


    run( deltaTime = 0) {
        // If we build a capability to move the update a given timestep
        // we can use timestamp to determine the delta between the last
        // frame and this one. Use that depta to determine the TimeStep
        this.update( deltaTime );
        this.render( deltaTime );

        window.requestAnimationFrame( deltaTime => { this.run( deltaTime )})
    }


    //---------------------------------------------------------------------
    // PRIVATE METHODS

    #_initScreens() {
        // access my private variables
        const my = this.__private__;

        let enableEvents = false

        // Show splash, hide others

        // listen for play now
        // hide splash show game

        // setup listener on result for "new level".

        // listen for server sent events
        if (!enableEvents)
            return Game.STATE.LOADING;

        // const source = new EventSource('/events');
        // source.addEventListener('message', event => {

        //     console.log('Got', message);
        //     // Display the event data in the `content` div
        //     document.querySelector('#log-area').innerHTML = event.data;
        // });

        return Game.STATE.LOADING
    }


    #_initGame() {
        // access my private variables
        const my = this.__private__; // alias

        /* Create the game entities  */
        my.world = new World( my.$view ); // Create the physics world model
        return new Promise( async ( resolve, reject ) => {

            const levelData = await my.world.loadLevel("level_1");
            const level = levelData.level;
            my.levelName = level.name;

            this.#_createCollidables( level.entities.collidables );
            this.#_createTargets( level.entities.targets );

            my.cannon = new Cannon( level.cannon.x, level.cannon.y );
            my.$view.append( my.cannon.$view );
            my.cannon.render();
            my.cannon.ammo = level.projectiles;

            // Keypress events to aim the cannon
            $(document).on('keypress',   event => my.cannon.aim( event.key ));

            // Launch a farmyard friend
            $("#launch-btn").on('click', event => my.cannon.fire( my.world, my.entityList ));

            resolve( Game.STATE.GAME )
        })
    }


    #_initDebug() {
        // access my private variables
        const my = this.__private__;

        //debug = world.enabledebug();
        my.debug = true;

        $("#reset-button").on('click',   event => document.location.reload()); // Simple solution; reload to reset
        $("#remove-text").on('click',    event => $(".panel p").hide()); // Hide the instructional text
        $('#show-debug-info').on('click', event => {
            // toggle debug info on and off.
            my.debug = true;
            my.world.enabledebug();
            if (my.debug) {
                my.debug = false;
                my.world.disabledebug();
            }
        });

        $("#game-area").on('mousemove', event => {

            let pos = new Point( event.clientX, event.clientY, Point.SCREEN );
            $("#mouse-coords").val( event.clientX + " : " + event.clientY );

            let pt = new Point( pos.x, pos.y, Point.WORLD);
            $("#world-coords").val(`${pt.x}:${pt.y}`);
        });
    }


    #_createCollidables( collidableList ) {
        // access my private variables
        const my = this.__private__;

        // Build from collidableList
        for (let collidable of collidableList) {

            let $div = this.#_createView({ prefix:"obstacle", gameObj: collidable });
            $div.addClass( collidable.texture );
            my.$view.append( $div );
            let thing = new GameObject( my.world, $div );
            my.entityList[my.entityList.length] = thing;
        }
    }


    #_createTargets( targetList ) {
        // Create the birds to fly away
        // access my private variables
        const my = this.__private__;

        // Build from collidableList
        let $div = {};
        let thing = {};
        for (let target of targetList) {

            $div = this.#_createView({prefix:"target", gameObj: target });
            my.$view.append( $div );
            thing = new Bird( my.world, $div );
            my.targetList.push( thing );
            my.entityList[my.entityList.length] = thing;
        }
    }


    #_createView({ prefix, gameObj }) {

        let $div = $(`<div id="${prefix}-${gameObj.id}" class="entity ${prefix}"></div>`);
        $div.css({
            'height':`${gameObj.height}px`,
            'width': `${gameObj.width}px`,
            'transform': `translate(${gameObj.x}px, ${gameObj.y}px) rotate(0deg)`
        });

        return $div
    }
}


// Main
const game = new Game();

