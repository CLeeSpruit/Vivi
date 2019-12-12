class ServiceFactory {
    prerequisites = new Map();
    instances = new Map();
    counter = 1;

    constructor(constructor, prerequisitesArr) {
        if (prerequisitesArr) {
            prerequisitesArr.forEach(prereq => {
                this.prerequisites.set(prereq.constructor.name, prereq);
            });
        }

        this.create();
    }

    create() {
        const service = new this.constructor(...Array.from(this.prerequisites.values()).map(pre => pre.get()));
        service.setData(this.counter);
        this.counter++;
        this.instances.set(service.id, service);

        return service;
    }

    get(id) {
        if (id) {
            return this.instances.get(id);
        } else {
            return Array.from(this.instances.values())[this.instances.size - 1] || null;
        }
    }

    destroy(id) {
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
exports.default = ServiceFactory;