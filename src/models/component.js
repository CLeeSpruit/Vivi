import {Listener} from '../events/listener';
import {FactoryService} from '../services/factory.service';
import {ApplicationEventService} from '../services/application-event.service';
import {ParseEngineService} from '../services/parse-engine.service';
import {NodeTreeService} from '../services/node-tree.service';
import {getElNameFromComponent} from '../helpers/get-el-name-from-component';
import {getElements} from '../decorators/element.decorator';

export class Component {
	constructor() {
		this.listeners = [];

		// Default Services
		this.factoryService = (window.vivi.get(FactoryService));
		this.appEvents = this.factoryService.getFactory(ApplicationEventService).get();
		this.engine = this.factoryService.getFactory(ParseEngineService).get();
		this.nodeTreeService = this.factoryService.getFactory(NodeTreeService).get();

		// Get template and style file

		// Turns a name like "SearchBarComponent" to look for "search-bar.component.xyz"
		this.componentName = getElNameFromComponent(this.constructor.name);
		/*
            @todo Allow for components to grab the module folder / multiple modules
            @body Currently file structure is root/component-name/component-name.component.xyz. Allow for components to be in directories based off of the module
        */
		const directory = this.componentName + '/' + this.componentName;

		// Sadly because of how context replacement plugin works for webpack, this can't really be functionalized
		try {
			this.template = require('vivi_application/' + directory + '.component.html');
		} catch {
			this.template = '';
		}

		try {
			this.style = require('vivi_application/' + directory + '.component.scss');
		} catch {
			this.style = '';
		}
	}

	setData(id, data) {
		this.data = data || {};
		this.id = `${this.componentName}-${id}`;
	}

	getUnparsedNode() {
		// Create Node that is named after the component class
		const el = document.createElement(this.componentName);
		el.id = this.id;
		el.innerHTML = this.template;
		return el;
	}

	createNodes() {
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
			document.head.append(styleEl);
		}

		// Load data into template
		this.parsedNode = this.getUnparsedNode();
		this.engine.parse(this.parsedNode, this.data, this);
	}

	append(parentEl, replaceEl) {
		if (!parentEl) {
			console.error(`Error while appending ${this.id}. Parent element does not exist.`);
			return;
		}

		if (!this.parsedNode) {
			this.createNodes();
		}

		if (replaceEl) {
			parentEl.replaceChild(this.parsedNode, replaceEl);
		} else {
			parentEl.append(this.parsedNode);
		}
	}

	startLoad() {
		// Assign Element and class params
		this.element = document.querySelector(this.id);
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
		const oldEl = document.querySelector(this.id);
		const newEl = this.getUnparsedNode();
		const parentEl = oldEl.parentElement;
		this.engine.parse(newEl, this.data, this);
		parentEl.replaceChild(newEl, oldEl);
		this.parsedNode = newEl;
		this.element = document.querySelector(this.id);
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
	listen(el, eventType, cb, options) {
		this.listeners.push(new Listener(eventType, el, cb.bind(this), options));
	}

	appListen(eventName, cb, options) {
		this.listeners.push(this.appEvents.createListener(eventName, cb.bind(this), options));
	}

	createChild(parentEl, component, data) {
		const factory = this.factoryService.getFactory(component);
		return factory.create(this, data, {parentEl});
	}
}
