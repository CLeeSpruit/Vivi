import { Service } from '../models/service.class';

export class ServiceFactory<T extends Service = Service> {
    prerequisites: Map<string, ServiceFactory> = new Map<string, ServiceFactory>();
    instances: Map<string, T> = new Map<string, T>();
    private counter = 1;

    constructor(
        private constructor: new (...args) => T,
        prerequisitesArr?: Array<ServiceFactory>
    ) {
        if (prerequisitesArr) {
            prerequisitesArr.forEach(prereq => {
                this.prerequisites.set(prereq.constructor.name, prereq);
            });
        }

        this.create();
    }

    create(): T {
        const service = new this.constructor(...Array.from(this.prerequisites.values()).map(pre => pre.get()));
        service.setData(this.counter);
        this.counter++;
        this.instances.set(service.id, service);

        return service;
    }

    get(id?: string): T {
        if (id) {
            return this.instances.get(id);
        } else {
            return Array.from(this.instances.values())[this.instances.size - 1] || null;
        }
    }

    destroy(id: string) {
        const service = this.get(id);
        // Run cleanup
        service.destroy();

        // Remove from the map
        this.instances.delete(id);
    }

    destroyAll() {
        this.instances.forEach(service => this.destroy(service.id));
    }
}