/*
Node Express Server (MEVN Stack)
Copyright (c) 2019-2020. Scott Henshaw, Kibble Online Inc. All Rights Reserved.
*/
'use strict';

import { fileURLToPath } from 'url'
import Path, { dirname } from 'path'
import FileSystem from 'fs-extra'  // supports promses

const __filename = fileURLToPath( import.meta.url );
const __dirname = Path.resolve();

export default class FileList {

    constructor( userid = "test_user",  relativePath = "") {

        this.relativePath = relativePath;
        this.userid = userid;
        this.fileList = [];
    }

    get fullPath() {
        let dataPath = `${Path.dirname( FileSystem.realpathSync(__filename))}\\data`;
        dataPath += `\\${this.userid}${this.relativePath}`;
        return dataPath
    }

    fetch() {

        return new Promise( async ( resolve, reject ) => {
            // Node FS lib, readdir asynchronous, with types returns 'dirent' objects
            const fnameList = await FileSystem
                .readdir( this.fullPath, { withFiletypes: true })
                .catch( err => reject( err ));

            let assert = true;
            for (let entry of fnameList) {
                // check each dirent object for the file type json,
                if (entry.endsWith(".json")) {
                    // then add those base names to the list
                    this.fileList.push( entry.replace(".json",""))
                }
            }
            resolve( this.fileList )
        })
    }


    myAsyncThing() {

        return new Promise(( resolve, reject ) => {})
    }

}