import {listen} from '@cspruit/zephyr';
import {ApplicationEventService} from '../services/application-event.service';
import {ParseEngineService} from '../services/parse-engine.service';
import {NodeTreeService} from '../services/node-tree.service';
import {getElNameFromComponent} from '../helpers/get-el-name-from-component';
import {Instance} from './instance';

export class Component extends Instance {
	/**
	 * Sets id, data, prereqs of component.
	 * Grabs appEvents, parseEngine, and nodeTree services
	 * Triggers setFiles Fn
	 *
	 * @param {number} id - Number to be assigned to component
	 * @param {*} [data] - Data to be passed to the component
	 * @memberof Component
	 */
	setData(id, data) {
		super.setData(id, data);

		// Turns a name like "SearchBarComponent" to look for "search-bar.component.xyz"
		this.componentName = getElNameFromComponent(this.constructor.name);
		this.appEvents = this.factoryService.getFactory(ApplicationEventService).get();
		this.engine = this.factoryService.getFactory(ParseEngineService).get();
		this.nodeTreeService = this.factoryService.getFactory(NodeTreeService).get();

		this.setFiles();
	}

	/**
	 * Set Template and Style for component. Leave to import from vivi_application/componentName/component-name.component.html/scss
	 *
	 * @memberof Component
	 */
	setFiles() {
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

	/**
	 * Retreives raw template element without any parsing
	 *
	 * @returns {HTMLElement} - Raw template html element
	 * @memberof Component
	 */
	getUnparsedNode() {
		// Create Node that is named after the component class
		const el = document.createElement(this.componentName);
		el.id = this.id;
		el.innerHTML = this.template;
		return el;
	}

	/**
	 * Creates child nodes based off of template
	 *
	 * @memberof Component
	 */
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

	/**
	 * Appends component to an element
	 *
	 * @param {HTMLElement} parentEl - Element to append component element to
	 * @param {HTMLElement} [replaceEl] - Element to replace on append. Should be child of parentEl
	 * @memberof Component
	 */
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

	/**
	 * Begins the load hook
	 *
	 * @memberof Component
	 */
	startLoad() {
		// Assign Element
		this.element = document.querySelector('#' + this.id);
		if (!this.element) {
			console.warn(`Error while loading ${this.id}. Element not was not created.`);
		}

		// User Hook
		this.load();
	}

	/**
	 * Runs the component through the parse engine
	 *
	 * @memberof Component
	 */
	redraw() {
		// Remove
		const oldEl = document.querySelector('#' + this.id);
		const newEl = this.getUnparsedNode();
		const parentEl = oldEl.parentElement;
		this.engine.parse(newEl, this.data, this);
		parentEl.replaceChild(newEl, oldEl);
		this.parsedNode = newEl;
		this.element = document.querySelector('#' + this.id);
	}

	/**
	 * Removes Component from DOM
	 *
	 * @memberof Component
	 */
	detach() {
		if (this.element) {
			this.element.remove();
		}
	}

	/**
	 * Removes component from DOM
	 *
	 * @memberof Component
	 */
	destroy() {
		this.detach();
	}

	/* Actions */
	/**
	 * Creates an element listener
	 *
	 * @param {HTMLElement} el - Element to attach the listener to
	 * @param {string} eventType - Event type, can be defined by Zephyr's EventTypes or any accepted event, like 'click' or 'onMouseDown'
	 * @param {Function} cb - Function to call when event fires
	 * @memberof Component
	 */
	listen(el, eventType, cb) {
		listen(el, eventType, cb.bind(this));
	}

	/**
	 * Creates a listener that waits for an application event to fire to trigger callback
	 *
	 * @param {string} eventName - Custom name of event. Will fire event when eventName matches
	 * @param {Function} cb - Function to call when event fires
	 * @memberof Component
	 */
	appListen(eventName, cb) {
		this.appEvents.createListener(eventName, cb.bind(this));
	}

	/**
	 * Creates a child component attached to an element
	 *
	 * @param {HTMLElement} parentEl - Element anchor point to attach to
	 * @param {Function} component - Component constructor function
	 * @param {*} [data] - parameters to create component
	 * @returns {Component} - Resulting component created
	 * @memberof Component
	 */
	createChild(parentEl, component, data) {
		const factory = this.factoryService.getFactory(component);
		return factory.create(this, data, {parentEl});
	}
}
