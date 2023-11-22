/**
 * Copyright (C) 2018-2020 Scott Henshaw, All rights Reserved
 */
'use strict';
export default class EditSelector {

    constructor( $element ) {

        this.$selected = $element;
    }

    select( $element ) {

        if ($element != undefined)
            this.$selected = $element;

        // Add the selected class
        const width = this.$selected.width();
        const height = this.$selected.height();
        const pos = this.$selected.position();

        const $handler = $(`
            <div class="selected" style="width:${width}px; height:${height}px">
                <div id="handles">
                    <span class="selection-handle" style="top:-3px;left:-3px"></span>
                    <span class="selection-handle" style="top:-3px;right:-3px"></span>
                    <span class="selection-handle" style="bottom:-3px;left:-3px"></span>
                    <span class="selection-handle" style="bottom:-3px;right:-3px"></span>
                </div>
            </div>`);
        $handler.append( $element );
        $handler.css({
            'top':`${pos.top}px`,
            'left':`${pos.left}px`,
            'width':`${width}px`,
            'height':`${height}px`
        });

        // Add the draggable handles and activate them
        $(".selection-handle").on('dragstart', event => {

            const $handle = $(event.target.parentElement);
            this.$selected.width += event.offsetX;
            this.$selected.height += event.offsetY;
        })

        // return it so the caller can add it to the DOM
        return $handler;
    }

    deselect( $element ) {

        if ($element != undefined)
            this.$selected = $element;

        // remove the parent element, but place the $element back in the DOM
        const $handler = $element.parent();
        const $editor = $handler.parent();


        $handler.remove(".selected");
        $editor.append( $element );
        this.$selected = undefined;

        return $element;
    }
}
