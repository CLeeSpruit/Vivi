import * as uuid from 'uuid';
import { ApplicationListener, Listener } from '../events';
import { ComponentParams } from './component-params.class';
import { ComponentIngredient } from './component-ingredient.class';

export abstract class Component {
    id: string;
    template: string;
    style: string;
    element: HTMLElement;
    node: Node;
    parent: Node;
    isLoaded: boolean = false;
    isVisible: boolean = false;
    recipe: Array<ComponentIngredient> = new Array<ComponentIngredient>(); // Contains children from the template
    listeners: Array<Listener | ApplicationListener> = new Array<Listener | ApplicationListener>();
    data: Object = {};

    constructor(protected params: ComponentParams = {}) {
        this.id = uuid();

        // Get template and style file

        // Turns a name like "SearchBarComponent" to look for "search-bar.component.xyz"
        const dirname = this.constructor.name.replace('Component', '').replace(/\B(?=[A-Z])/, '-').toLowerCase();
        const directory = dirname + '/' + dirname;

        if (!this.template) {
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
        }

        if (!this.style) {
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
    }
    
    createNode() {
        const name = (<Object>this).constructor.name;

        // Create Node that is named after the component class
        const node = document.createElement(name);
        node.id = this.id;
        node.innerHTML = this.template;
        this.node = node;
        // Load data into template

        // Parse class names
        this.attributeParse('v-class', (name, el, attr) => {
            const list = attr.split(' ');
            const parsed = list.filter(li => this.data.hasOwnProperty(li)).map(li => this.data[li]);
            el.classList.add(...parsed);
        });

        // TODO: Just go over a list of known html element attributes
        this.attributeParse('v-innerHTML');
        this.attributeParse('v-href');
    }

    private attributeParse(name: string, customParseFn?: (name: string, el: Element, attr: string) => void) {
        (<HTMLElement>this.node).querySelectorAll('[' + name + ']').forEach(el => {
            const attr = el.getAttribute(name);

            if (customParseFn) {
                customParseFn(name, el, attr);
            } else {
                // Do a simple replace
                const regex = name.match(/^v-(.*)/);
                if (this.data.hasOwnProperty(attr) && regex.length > 1) {
                    const nonVAttr = regex[1];
                    el.setAttribute(nonVAttr, this.data[attr]);
                }
            }
            // Rename to data to make parseable
            el.setAttribute('data-' + name, attr);
            el.removeAttribute(name);
        });
    }

    createRecipe(recipe: Array<ComponentIngredient>) {
        this.recipe = recipe;
        this.recipe.forEach(ingredient => ingredient.create());
    }

    load() {
        // Placeholder hook for inherited classes
    }

    append(parent?: Node) {
        if (!this.node) {
            this.createNode();
        }

        if (!parent) {
            parent = document.body;
        }
        parent.appendChild(this.node);

        // Set class variables
        this.parent = parent;
        this.isLoaded = true;
        this.isVisible = true;
        this.element = document.getElementById(this.id);

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