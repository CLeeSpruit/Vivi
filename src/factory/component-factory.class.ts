import { ViviServiceFactory } from './';
import { Component, Service } from '../models';

export class ViviComponentFactory<T> {
    private components: Map<string, Component> = new Map<string, Component>();
    private counter = 1;

    constructor(
        private constructor: new (...args) => Component,
        private services: Array<ViviServiceFactory<Service>> = new Array<ViviServiceFactory<Service>>()
    ) {
        //
    }

    create(data?: Object): Component {
        const component = new this.constructor(...this.services.map(service => service.get()));
        component.setData(this.counter, data);
        this.counter++;

        this.components.set(component.id, component);
        return component;
    }

    destroy(id: string) {
        const component = this.get(id);

        if (!component) {
            console.error(`${this.constructor.name}: No component found with id: ${id}`);
            return;
        }

        // Run cleanup
        component.destroy();

        // Remove from the DOM
        const node = document.getElementById(id);
        if (node) {
            node.remove();
        }

        // Remove from the map
        this.components.delete(id);
    }

    destroyAll() {
        this.components.forEach(comp => this.destroy(comp.id));
    }

    get(id?: string): Component {
        if (id) {
            // TODO: Throw error if id doesn't exist
            return this.components.get(id);
        } else {
            // TODO: throw error (or warning) if this.components.length is 0
            // TODO: Should this grab the last component instead?
            return Array.from(this.components.values())[0] || null;
        }
    }
}