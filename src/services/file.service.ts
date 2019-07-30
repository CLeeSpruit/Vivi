import { WriteStream } from 'fs';
import { Observable, AsyncSubject } from 'rxjs';
import { Service } from '../models';
import { SystemService } from './';

export class FileService extends Service {
    constructor(
        private system: SystemService
    ) {
        super();
    }

    readAsync(appPath: string, fileName: string, extension: string = '.json'): Observable<string> {
        const async = new AsyncSubject<string>();

        // TODO: Utf doesn't work for non-json file
        const path = this.system.path.join(appPath, fileName + extension);
        this.system.fs.readFile(path, 'utf8', (error, data) => {
            if (error) {
                async.error(error);
            } else {
                async.next(data);
            }
            async.complete();
        });

        return async.asObservable();
    }

    read(appPath: string, fileName: string, extension: string = '.json'): string {
        // TODO: Utf doesn't work for non-json files
        const path = this.system.path.join(appPath, fileName + extension);
        try {
            return this.system.fs.readFileSync(path, 'utf8');
        } catch (e) {
            return null;
        }
    }

    write(appPath: string, fileName: string, data: any, extension: string = '.json'): void {
        // TODO: Handle non-json
        const path = this.system.path.join(appPath, fileName + extension);
        this.system.fs.writeFileSync(path, JSON.stringify(data), 'utf8');
    }

    writeAsync(appPath: string, fileName: string, data: any, extension: string = '.json'): Observable<void> {
        const async = new AsyncSubject<void>();
        const path = this.system.path.join(appPath, fileName + extension);

        // TODO: Handle non-json
        this.system.fs.writeFile(path, JSON.stringify(data), 'utf8', (error) => {
            if (error) {
                async.error(error);
            } else {
                async.next(null);
            }
            async.complete();
        });

        return async.asObservable();
    }

    // For files that have multiple writes
    startMultiWrite(appPath: string, fileName: string, data?: any, extension: string = '.json'): WriteStream {
        const path = this.system.path.join(appPath, fileName + extension);
        const stream = this.system.fs.createWriteStream(path, { flags: 'a' });
        if (data) {
            stream.write(JSON.stringify(data));
        }

        return stream;
    }

    writeToStream(stream: WriteStream, data: any) {
        stream.write(JSON.stringify(data));
    }

    createDirectory(dirPath: string, newDir: string) {
        this.system.fs.mkdirSync(this.system.path.join(dirPath, newDir));
    }

    existsDirectory(dirPath, dir: string) {
        return this.system.fs.existsSync(this.system.path.join(dirPath, dir));
    }

    existsFile(appPath: string, fileName: string, extension: string = '.json'): boolean {
        return this.system.fs.existsSync(this.system.path.join(appPath, fileName + extension));
    }
}