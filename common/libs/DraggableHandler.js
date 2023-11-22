/**
 * Draggable Handler Class
 * 
 * Copyright 2016, VFS.  All Rights Reserved.
 */
'use strict';


if (__private__ === undefined)
    var __private__ = new WeakMap();

class DraggableHandler {
    
    constructor( domElement$ ) {
	
        // Public attributes (available in prototype members)
        this.mouseDown = false;
        this.mouseOver = false;
        this.thing = null;
        this.offsetX = null;
        this.offsetY = null;
        this.zIndex = 1;    

        let m ={
            draggable: domElement$        
        };
        __private__.set( this, m );

        // event handlers
        m.draggable.mousedown( this.down )
        m.draggable.mousemove( this.move );
        m.draggable.mouseover( this.over );
        m.draggable.mouseout( this.out );
        m.draggable.mouseup( this.up );

    }
    
    get offsetX() {
            
        if (this.mOffsetX == null)
            return 0;
        
        return this.mOffsetX; 
    }

    get offsetY() { 

        if (this.mOffsetY == null)
            return 0;
        
        return this.mOffsetY; 
    }
	
    down( event ) {
	
    	if (this.mouseOver) {
    		
    	    // record the mouse
    		this.mouseDown = true;
    		this.offsetX = event.clientX - Math.floor( this.thing.offsetLeft );
    		this.offsetY = event.clientY - Math.floor( this.thing.offsetTop );

    		// save the z-index (depth)
    		this.zIndex = this.thing.style.zIndex;
    		this.thing.style.zIndex = 10000;
    		
    		// Change the cursor
    		this.thing.style.cursor = "move";
    	}
    }

    move( event ) {
	
    	if (this.mouseDown && this.mouseOver && this.thing != null) {
    		
    		this.thing.style.position = "absolute";
    		this.thing.style.margin = "0px";
    		this.thing.style.left = event.clientX - this.offsetX + "px";
    		this.thing.style.top = event.clientY - this.offsetY + "px";
    	}
    }

    over( event ) {

        // make the thing whatever element we are hovering over
    	this.thing = event.target;
    		
    	//if(this.thing.className == "draggable") {
    	if ( (" " + this.thing.className).replace(/[\n\t]/g, " ").indexOf(" draggable") > -1 ) {
    		
    		this.mouseOver = true;
    	}
    	else {
    		
    		this.mouseOver = false;
    		this.thing = null;
    	}
    }

    out( event ) {
    	
    	this.mouseOver = false;
    	this.thing = null;
    }

    up( event ) {
    
    	this.mouseDown = false;
    	if(this.thing != null) {
    		
    	    // reset the z-index
    		this.thing.style.zIndex = this.zIndex;
    		this.zIndex = 100;
    		
    		// reset the cursor
    		this.style.cursor = "pointer";
    	}
    }
}



