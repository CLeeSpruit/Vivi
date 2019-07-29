import { ApplicationListener } from '@events/application-listener.class';
import { Listener } from '@events/listener.class';

export abstract class Component {
    id: string;
    template: string;
    element: HTMLElement;
    parent: Node;
    isLoaded: boolean = false;
    isVisible: boolean = false;
    children: Array<Component> = new Array<Component>();
    listeners: Array<Listener | ApplicationListener> = new Array<Listener | ApplicationListener>();

    constructor(id: string, template: string) {
        this.id = id;
        this.template = template;
    }

    load() {
        // Placeholder
    }

    append(parent?: Node) {
        const name = (<Object>this).constructor.name;

        // Create Node
        const node = document.createElement(name);
        node.id = this.id;
        node.innerHTML = this.template;
        if (!parent) {
            parent = document.body;
        }
        parent.appendChild(node);

        // Set class variables
        this.parent = parent;
        this.isLoaded = true;
        this.isVisible = true;
        this.element = document.getElementById(this.id);

        // Tell children to do the same
        // TODO: Do not append children to the bottom, because who would want that?
        this.children.forEach(child => child.append(node));

        // Run load hook
        this.load();
    }

    detach() {
        this.element.remove();
        this.isLoaded = false;
        this.isVisible = false;
        this.parent = null;
    }

    destroy() {
        this.listeners.forEach(listener => {
            listener.remove();
        });
    }
}