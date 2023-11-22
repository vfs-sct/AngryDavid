/*
Node Express Server Route Module for a Level Save/LOad (MEVN Stack)
Copyright (c) 2019. Scott Henshaw, Kibble Online Inc. All Rights Reserved.
*/
'use strict';

import FileSystem from 'fs-extra'
import FileList from './FileList.js'

export default class LevelLoader {

    constructor( userId = 'test_user') {
        this.userid = userId;
        this.fileList = new FileList( this.userid );
    }

    load( name, type = 'level' ) {
        // @async version
        return new Promise( async ( resolve, reject ) => {
            // OK, we have a valid request, lets do it.
            const fileNameList = await this.fileList.fetch()
                .catch( err => reject( err ))

            // TODO: handle the missing file problem
            const baseFolder = this.fileList.fullPath;
            const libFolder = (type === 'object' ? '\\library' : '');
            const fname = `${baseFolder}${libFolder}\\${name}.json`;
            const contents = await FileSystem.readFile( fname,"utf8")
                .catch( err => reject( err ));

            if (contents === undefined) {
                const err = new Error();
                reject( err )
            }

            resolve( contents )
        })
    }

    save( levelname, payload ) {
        // Vanilla Promise Version
        return new Promise( async ( resolve, reject ) => {

            let baseFolder = this.fileList.fullPath;
            let fname = `${baseFolder}/${levelname}.json`;
            const content = await FileSystem.writeFile( fname, payload ).catch( err => reject( err ));

            resolve( content )
        })
    }
}