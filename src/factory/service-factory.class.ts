import { Service } from 'models/service.class';

// @todo Rename to ServiceFactory
// @todo Use generic T for Typings
export class ViviServiceFactory<T> {
    prerequisites: Map<string, ViviServiceFactory<Service>> = new Map<string, ViviServiceFactory<Service>>();
    instances: Map<string, Service> = new Map<string, Service>();

    constructor(
        private constructor: new (...args) => Service,
        prerequisitesArr?: Array<ViviServiceFactory<Service>>
    ) {
        if (prerequisitesArr) {
            prerequisitesArr.forEach(prereq => {
                this.prerequisites.set(prereq.constructor.name, prereq);
            });
        }

        this.create();
    }

    create(): Service {
        const service = new this.constructor(...Array.from(this.prerequisites.values()).map(pre => pre.get()));
        this.instances.set(service.id, service);

        return service;
    }

    get(id?: string): Service {
        if (id) {
            return this.instances.get(id);
        } else {
            return Array.from(this.instances.values())[0] || null;
        }
    }

    destroy(id: string) {
        const service = this.get(id);
        // Run cleanup
        service.destroy();

        // Remove from the map
        this.instances.delete(id);
    }
}