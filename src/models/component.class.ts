import { ApplicationListener, Listener } from '../events';
import { ApplicationEventService, ListenerOptions } from '../services/application-event.service';
import { getElements } from '../decorators/element.decorator';
import { ComponentFactory } from 'factory/component-factory.class';
import { ParseEngineService } from '../services/parse-engine.service';
import { FactoryService } from '../services/factory.service';
import { GetElNameFromComponent } from '../helpers/get-el-name-from-component';

export abstract class Component {
    id: string;
    componentName: string;
    template: string;
    style: string;
    data: Object;
    element: HTMLElement;
    parsedNode: HTMLElement;
    listeners: Array<Listener | ApplicationListener> = new Array<Listener | ApplicationListener>();

    // Default Services
    factoryService: FactoryService;
    appEvents: ApplicationEventService;
    engine: ParseEngineService;

    constructor() {
        // Default Services
        this.appEvents = (<any>window).vivi.get(ApplicationEventService);
        this.factoryService = (<any>window.vivi.get(FactoryService));
        this.engine = (<any>window).vivi.get(ParseEngineService);

        // Get template and style file

        // Turns a name like "SearchBarComponent" to look for "search-bar.component.xyz"
        this.componentName = GetElNameFromComponent(this.constructor.name);
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

    setData(id: number, data?: Object) {
        this.data = data || {};
        this.id = `${this.componentName}-${id}`;
    }

    private getUnparsedNode(): HTMLElement {
        // Create Node that is named after the component class
        const el = document.createElement(this.componentName);
        el.id = this.id;
        el.innerHTML = this.template;
        return el;
    }

    private createNodes() {
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
        this.parsedNode = this.getUnparsedNode();
        this.engine.parse(this.parsedNode, this.data, this);
    }

    append(parentEl: HTMLElement, replaceEl?: HTMLElement) {
        if (!parentEl) {
            console.error(`Error while appending ${this.id}. Parent element does not exist.`);
            return;
        }
        if (!this.parsedNode) this.createNodes();

        if (replaceEl) {
            parentEl.replaceChild(this.parsedNode, replaceEl);
        } else {
            parentEl.appendChild(this.parsedNode);
        }
    }

    startLoad() {
        // Assign Element and class params
        this.element = document.getElementById(this.id);
        if (!this.element) {
            console.warn(`Error while loading ${this.id}. Element not was not created.`);
        }
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
        const newEl = this.getUnparsedNode();
        const parentEl = oldEl.parentElement;
        this.engine.parse(newEl, this.data, this);
        parentEl.replaceChild(newEl, oldEl);
        this.parsedNode = newEl;
        this.element = document.getElementById(this.id);
    }

    detach() {
        this.element.remove();
    }

    /* Hooks */
    load() {
        // Placeholder hook for inherited classes
    }

    destroy() {
        this.listeners.forEach(listener => {
            listener.remove();
        });
        if (this.element) {
            this.element.remove();
        }
    }

    /* Actions */
    listen(el: HTMLElement, eventType: string, cb: Function, options?: AddEventListenerOptions) {
        this.listeners.push(new Listener(eventType, el, cb.bind(this), options));
    }

    appListen(eventName: string, cb: Function, options?: ListenerOptions) {
        this.listeners.push(this.appEvents.createListener(eventName, cb.bind(this), options));
    }

    createChild(parentEl: HTMLElement, component: new (...args) => Component, data?: Object) {
        const factory = this.factoryService.getFactory(component);
        factory.create(this, data, { parentEl });
    }
}