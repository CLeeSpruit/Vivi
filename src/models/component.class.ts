import * as uuid from 'uuid';
import { ApplicationListener, Listener } from '../events';
import { ComponentParams } from './component-params.class';

export abstract class Component {
    id: string;
    template: string;
    style: string;
    element: HTMLElement;
    parent: Node;
    isLoaded: boolean = false;
    isVisible: boolean = false;
    children: Array<Component> = new Array<Component>();
    listeners: Array<Listener | ApplicationListener> = new Array<Listener | ApplicationListener>();
    params: ComponentParams;

    constructor() {
        this.id = uuid();

        // Get template and style file

        // Turns a name like "SearchBarComponent" to look for "search-bar.component.xyz"
        const dirname = this.constructor.name.replace('Component', '').replace(/\B(?=[A-Z])/, '-').toLowerCase();
        const directory = dirname + '/' + dirname;
        // Sadly because of how context replacement plugin works for webpack, this can't really be functionalized
        try {
            this.template = require('vivi_application/' + directory + '.component.html');
        } catch (e) {
            // A vaild error, throw it back out to sea
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }
            this.template = '';
        }

        try {
            this.style = require('vivi_application/' + directory + '.component.scss');
        } catch (e) {
            // A vaild error, throw it back out to sea
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }
            this.style = '';
        }
    }

    load() {
        // Placeholder
    }

    append(parent?: Node) {
        const name = (<Object>this).constructor.name;

        // Create Node that is named after the component class
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