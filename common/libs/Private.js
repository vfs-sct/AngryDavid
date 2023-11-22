/**
 * @name The Private data store
 *
 * @Copyright 2014-2018, Kibble Games Inc, in cooperation with VFS.  All Rights Reserved.
 * @usage
 *   // in constructor
 *   let my = app.private( this, somePrivateDataObject );
 *
 *   // in methods
 *   let my = app.private( this );
 *
 */
'use strict';

class PrivateData {

    constructor() {
        this.data = new WeakMap();
    }

    members(object = undefined, value = null) {

        if (object === undefined)
            return null;

        if (value != null) {
            this.data.set(object, value);
        }

        return this.data.get(object);
    }
}
const self =  new PrivateData();
export { self };