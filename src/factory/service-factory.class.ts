import * as nodeUuid from 'uuid';

export class ViviServiceFactory<T> {
    prerequisites: Map<string, ViviServiceFactory<T>> = new Map<string, ViviServiceFactory<T>>();
    instances: Map<string, T> = new Map<string, T>();

    constructor(
        private constructor: new (...args) => T,
        prerequisitesArr: Array<ViviServiceFactory<T>>
    ) {
        prerequisitesArr.forEach(prereq => {
            this.prerequisites.set(prereq.constructor.name, prereq);
        });

        this.create();
    }

    create(options?: { returnService?: boolean }): string | any {
        const service = new this.constructor(...Array.from(this.prerequisites.values()).map(pre => pre.get()));
        const uuid: string = nodeUuid();
        this.instances.set(uuid, service);

        if (options && options.returnService) {
            return service;
        }

        return uuid;
    }

    get(id?: string): T {
        if (id) {
            return this.instances.get(id);
        } else {
            return Array.from(this.instances.values())[0] || null;
        }
    }
}