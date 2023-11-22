/*
Node Express Server (MEVN Stack)
Copyright (c) 2019-2020. Scott Henshaw, Kibble Online Inc. All Rights Reserved.
*/
'use strict';

export default class Result {

    constructor( error = 0, errMsg = "No Error") {

        let my = this.__private__ = {
            name: "",
            bytes: 0,
            payload: {},
            error,
            errMsg,
        }
        this.update( error, errMsg );
    }

    set name( filename ) { this.__private__.name = filename }

    code( errorCode = 0, errorMessage = "No Error" ) {
        let my = this.__private__;

        my.error = errorCode;
        my.errMsg = errorMessage;
    }

    update( errorCode = 0, errorMessage = "No Error", dataToSend = {} ) {

        let my = this.__private__;

        my.error = errorCode;
        my.errMsg = errorMessage;
        my.payload = dataToSend;
        my.bytes = JSON.stringify( my.payload ).length;  // rough debug only
    }

    serialized() { return JSON.stringify( this.__private__ ) }
}