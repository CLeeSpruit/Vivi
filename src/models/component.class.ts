import * as uuid from 'uuid';
import { ApplicationListener, Listener } from '../events';
import { ApplicationEventService, ListenerOptions } from '../services/application-event.service';
import { getElements } from '../decorators/element.decorator';
import { ModuleFactory, ViviComponentFactory } from 'factory';
import { ParseEngineService } from '../services/parse-engine.service';
import { FactoryService } from '../services/factory.service';

export abstract class Component {
    id: string;
    componentName: string;
    template: string;
    style: string;
    data: Object;
    element: HTMLElement;
    ogNode: HTMLElement;
    parsedNode: HTMLElement;
    parent: HTMLElement;
    children: Array<Component> = new Array<Component>();
    listeners: Array<Listener | ApplicationListener> = new Array<Listener | ApplicationListener>();

    // Default Services
    factoryService: FactoryService;
    appEvents: ApplicationEventService;
    engine: ParseEngineService;

    constructor() {
        this.id = uuid();

        // Default Services
        this.appEvents = (<any>window).vivi.get(ApplicationEventService);
        this.factoryService = (<any>window.vivi.get(FactoryService));
        this.engine = (<any>window).vivi.get(ParseEngineService);

        // Set default parent
        this.parent = document.body;

        // Get template and style file

        // Turns a name like "SearchBarComponent" to look for "search-bar.component.xyz"
        this.componentName = this.constructor.name.replace('Component', '').replace(/\B(?=[A-Z])/, '-').toLowerCase();
        /*
            @todo Allow for components to grab the module folder / multiple modules
            @body Currently file structure is root/component-name/component-name.component.xyz. Allow for components to be in directories based off of the module
        */
        const directory = this.componentName + '/' + this.componentName;

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

    private createNodes() {
        // Create Node that is named after the component class
        const el = document.createElement(this.componentName);
        el.id = this.id;
        el.innerHTML = this.template;
        this.ogNode = <HTMLElement>el.cloneNode(true);

        /*
            @todo: Add dynamic styling
            @body: Move this into the parse engine
        */
        // Create Node for Style
        const existing = document.head.querySelector(`style#style-${this.componentName}`);
        if (!existing && this.style) {
            // Create Style
            const styleEl = document.createElement('style');
            styleEl.id = `style-${this.componentName}`;
            styleEl.innerHTML = this.style;
            document.head.appendChild(styleEl);
        }

        // Load data into template
        this.parsedNode = this.engine.parseElements(el, this.data)
        this.children.push(...this.engine.parseComponents(el));
    }

    append(parent?: HTMLElement, doNotLoad?: boolean) {
        if (!this.ogNode) this.createNodes();
        if (!parent) parent = document.body;
        parent.appendChild(this.parsedNode);

        // Run load all, which loads children, then the load hook
        // Assign Element and class params
        this.element = document.getElementById(this.id);
        this.parent = parent;

        // Opt out of loading if this is an ingredient or is a re-attachment
        if (doNotLoad) return;

        this.loadAll();
    }

    loadAll() {
        if (!this.element) {
            console.error(`${this.componentName} needs to be appended before loading.`);
            return;
        }

        this.children.forEach(ingredient => ingredient.loadAll());

        // Load in decorated elements
        const els = getElements(this);
        els.forEach(el => {
            this[el.propertyKey] = this.element.querySelector(el.selector);
            if (el.handlerFnName) {
                this.listen(this[el.propertyKey], el.eventType, this[el.handlerFnName]);
            }
        });

        // User Hook
        this.load();
    }

    redraw() {
        // Remove 
        const oldEl = document.getElementById(this.id);
        const newEl = this.engine.parseElements(this.ogNode, this.data);
        this.parent.replaceChild(newEl, oldEl);
        this.parsedNode = newEl;
        this.element = document.getElementById(this.id);
    }

    detach() {
        this.element.remove();
        this.parent = null;
    }

    /* Hooks */
    load() {
        // Placeholder hook for inherited classes
    }

    destroy() {
        this.listeners.forEach(listener => {
            listener.remove();
        });
        this.children.forEach(child => {
            child.destroy();
        });
    }

    /* Actions */
    listen(el: HTMLElement, eventType: string, cb: Function, options?: AddEventListenerOptions) {
        this.listeners.push(new Listener(eventType, el, cb.bind(this), options));
    }

    appListen(eventName: string, cb: Function, options?: ListenerOptions) {
        this.listeners.push(this.appEvents.createListener(eventName, cb.bind(this), options));
    }

    createChild(parentEl: HTMLElement, component: new (...args) => Component, data?: Object) {
        const factory = (<ModuleFactory>window.vivi).getFactory(component) as ViviComponentFactory<Component>;
        const comp = factory.create(data);
        comp.append(parentEl);
        this.children.push(comp);
    }
}