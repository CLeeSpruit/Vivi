import { ViviServiceFactory } from './';
import { Component, Service } from '../models';

export class ViviComponentFactory<T> {
    private components: Map<string, Component> = new Map<string, Component>();
    private styleAppended: boolean;

    constructor(
        private constructor: new (...args) => Component,
        private services: Array<ViviServiceFactory<Service>> = new Array<ViviServiceFactory<Service>>(),
        private children: Array<ViviComponentFactory<Component>>
    ) {
        //
    }

    create(options?: { append?: boolean, parent?: Node, returnComponent?: boolean }): Component | string {
        const component = new this.constructor(...this.services.map(service => service.get()));
        this.createStyle(component.style);

        if (this.children) {
            component.children = this.children.map(child => {
                return <Component>child.create({ returnComponent: true });
            });
        }
        this.components.set(component.id, component);

        if (options && (options.parent || options.append)) {
            this.append(component.id, options.parent);
        }

        if (options && options.returnComponent) {
            return component;
        } else {
            return component.id;
        }
    }

    private createStyle(style: string) {
        if (style && !this.styleAppended) {
            const styleEl = document.createElement('style');
            styleEl.innerHTML = style;
            document.head.appendChild(styleEl);
            this.styleAppended = true;
        }
    }

    append(id: string, parent?: Node) {
        const component = this.get(id);
        component.append(parent);
    }

    hide(id: string) {
        const component = this.get(id);
        const node = document.getElementById(id);
        node.hidden = true;
        component.isVisible = false;
    }

    destroy(id: string) {
        const component = this.get(id);
        // Run cleanup
        component.destroy();

        // Remove from the DOM
        const node = document.getElementById(id);
        node.remove();

        // Remove from the map
        this.components.delete(id);
    }

    // TODO: Not Currently Used, determine if needed
    detach(id: string) {
        const component = this.get(id);
        component.detach();
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