import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https';

import { Service } from '../../models';

export class SystemService extends Service{
    path: typeof path;
    fs: typeof fs;
    https: typeof https;
    
    constructor() {
        super();
        this.path = <typeof path>{
            join: () => {}
        };
        this.fs = <typeof fs>{
            existsSync: (path: fs.PathLike) => { return true; },
            readFileSync: (path: string | Buffer) => { }
        };
        this.https = <typeof https>{
            //
        };
    }
}