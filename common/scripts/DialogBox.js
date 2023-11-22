/**
 * Copyright (C) 2018-2020 Scott Henshaw, All rights Reserved
 */
'use strict';
export default class DialogBox {

    constructor(title, $content) {

        this.title = title;

        // UI things for dialogs - another class?
        this.$modalMask = $("#dialog-mask");
        this.$container = $("#dialog-container");
        this.$container.prepend(`<h3>${this.title}</h3>`);

        this.$dialog = $("#dialog-content");
        this.$dialog.append( $content );
        $content.removeClass("hide");
    }

    show() {
        this.$modalMask.removeClass("hide");
        this.$container.removeClass("hide");
        this.$dialog.removeClass("hide");
    }

    hide() {
        this.$modalMask.addClass("hide");
        this.$container.addClass("hide");
        this.$dialog.addClass("hide");
    }
}
