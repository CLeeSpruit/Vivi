import * as uuid from 'uuid';
import { ApplicationListener, Listener } from '../events';
import { ComponentParams } from './component-params.class';
import { ComponentIngredient } from './component-ingredient.class';
import { ParseEngine } from './parse-engine.class';

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

        // Turn params into data
        // TODO: Consider defining a difference between params and data
        this.data = params;

        // Get template and style file

        // Turns a name like "SearchBarComponent" to look for "search-bar.component.xyz"
        const dirname = this.constructor.name.replace('Component', '').replace(/\B(?=[A-Z])/, '-').toLowerCase();
        const directory = dirname + '/' + dirname;

        // Sadly because of how context replacement plugin works for webpack, this can't really be functionalized
        try {
            this.template = require('vivi_application/' + directory + '.component.html');
        } catch (e) {
             this.template = '';
        }

        try {
            this.style = require('vivi_application/' + directory + '.component.scss');
        } catch (e) {
            this.style = '';
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
        this.node = ParseEngine.parseNode(node, this.data);
    }

    createRecipe(recipe: Array<ComponentIngredient>) {
        this.recipe = recipe;
        this.recipe.forEach(ingredient => ingredient.create());
    }

    loadAll(parent: Node) {
        // Assign Element and class params
        this.element = document.getElementById(this.id);
        this.parent = parent;
        this.isLoaded = true;
        this.isVisible = true;

        this.recipe.forEach(ingredient => ingredient.load(this.element));
        
        // Run hook
        this.load();
    }

    load() {
        // Placeholder hook for inherited classes
    }

    append(parent?: Node, doNotLoad?: boolean) {
        if (!this.node) {
            this.createNode();
        }

        if (!parent) {
            parent = document.body;
        }
        parent.appendChild(this.node);

        // Opt out of loading if this is an ingredient
        if (doNotLoad) {
            return;
        }

        // Run load all, which loads children, then the load hook
        this.loadAll(parent);
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