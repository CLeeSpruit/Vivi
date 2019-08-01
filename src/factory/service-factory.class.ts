import { Service } from 'models';

export class ViviServiceFactory<T> {
    prerequisites: Map<string, ViviServiceFactory<Service>> = new Map<string, ViviServiceFactory<Service>>();
    instances: Map<string, Service> = new Map<string, Service>();

    constructor(
        private constructor: new (...args) => Service,
        prerequisitesArr: Array<ViviServiceFactory<Service>>
    ) {
        prerequisitesArr.forEach(prereq => {
            this.prerequisites.set(prereq.constructor.name, prereq);
        });

        this.create();
    }

    create(options?: { returnService?: boolean }): string | Service {
        const service = new this.constructor(...Array.from(this.prerequisites.values()).map(pre => pre.get()));
        this.instances.set(service.id, service);

        if (options && options.returnService) {
            return service;
        }

        return service.id;
    }

    get(id?: string): Service {
        if (id) {
            return this.instances.get(id);
        } else {
            return Array.from(this.instances.values())[0] || null;
        }
    }
}