import { Config } from '../config';
import { WriteStream } from 'fs';
import { SystemService } from './system';
import { FileService } from './file';
import { Service } from '@system/service/service.class';

export class FileStoreService extends Service {
    directory: string;
    openFiles: Map<string, WriteStream> = new Map<string, WriteStream>();

    constructor(
        system: SystemService,
        private file: FileService
    ) {
        super();
        this.directory = system.remote.app.getPath('userData');
    }

    read<T>(fileName: string, type?: { new(...data: any): T }): T | Array<T> {
        const string = this.file.read(this.directory, fileName);
        try {
            const data = JSON.parse(string);
            if (!data) {
                return data;
            }
            if (type) {
                if (data instanceof Array) {
                    return data.map(obj => new type(...Object.values(obj)));
                }
                return new type(...Object.values(data));
            }
            return data;
        } catch (e) {
            return null;
        }
    }

    write(fileName: string, data: any): void {
        this.file.write(this.directory, fileName, data);
    }

    append(fileName: string, data: any): void {
        const stream = this.openFiles.get(fileName);
        if (stream) {
            this.writeStream(stream, data);
        } else {
            this.startMultiWrite(fileName, data);
        }
    }

    closeFile(fileName: string): void {
        const stream = this.openFiles.get(fileName);

        if (!stream) { return; }

        stream.close();
    }

    private startMultiWrite(fileName: string, data?: any) {
        const stream = this.file.startMultiWrite(this.directory, fileName, data);
        this.openFiles.set(fileName, stream);
    }

    private writeStream(stream: WriteStream, data: any) {
        this.file.writeToStream(stream, data);
    }

    installDirectories() {
        this.file.createDirectory(this.directory, Config.folderData);
        this.file.createDirectory(this.directory, Config.folderHistory);
        this.file.createDirectory(this.directory, Config.folderBookmarks);
        this.file.createDirectory(this.directory, Config.folderLogs);
        this.file.createDirectory(this.directory, Config.folderConfig);
    }

    hasBeenInstalled(): boolean {
        return this.file.existsDirectory(this.directory, Config.folderData);
    }
}
