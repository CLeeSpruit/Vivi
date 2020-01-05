import {listen} from '@cspruit/zephyr';
import {ApplicationEventService} from '../services/application-event.service';
import {ParseEngineService} from '../services/parse-engine.service';
import {NodeTreeService} from '../services/node-tree.service';
import {getElNameFromComponent} from '../helpers/get-el-name-from-component';
import {Instance} from './instance';

export class Component extends Instance {
	/**
	 *Set Template and Style for component. Leave to import from vivi_application/componentName/component-name.component.html/scss
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

	setData(id, data, prereqs) {
		super.setData(id, data, prereqs);

		// Turns a name like "SearchBarComponent" to look for "search-bar.component.xyz"
		this.componentName = getElNameFromComponent(this.constructor.name);
		this.appEvents = this.factoryService.getFactory(ApplicationEventService).get();
		this.engine = this.factoryService.getFactory(ParseEngineService).get();
		this.nodeTreeService = this.factoryService.getFactory(NodeTreeService).get();
	}

	/**
	 *Retreives raw template element without any parsing
	 *
	 * @returns {HTMLElement}
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
	 *Creates child nodes based off of template
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
	 *Appends component to an element
	 *
	 * @param {HTMLElement} parentEl
	 * @param {HTMLElement} replaceEl
	 * @returns
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
	 *Begins the load hook
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
	 *Runs the component through the parse engine
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
	 *Removes Component from DOM
	 *
	 * @memberof Component
	 */
	detach() {
		if (this.element) {
			this.element.remove();
		}
	}

	/**
	 *Removes component from DOM
	 *
	 * @memberof Component
	 */
	destroy() {
		this.detach();
	}

	/* Actions */
	/**
	 *Creates an element listener
	 *
	 * @param {HTMLElement} el
	 * @param {string} eventType
	 * @param {Function} cb
	 * @memberof Component
	 */
	listen(el, eventType, cb) {
		listen(el, eventType, cb.bind(this));
	}

	/**
	 *Creates a listener that waits for an application event to fire to trigger callback
	 *
	 * @param {string} eventName
	 * @param {Function} cb
	 * @memberof Component
	 */
	appListen(eventName, cb) {
		this.appEvents.createListener(eventName, cb.bind(this));
	}

	/**
	 *Creates a child component attached to an element
	 *
	 * @param {HTMLElement} parentEl
	 * @param {Function} component - Component constructor function
	 * @param {*} data - parameters to create component
	 * @returns {Component}
	 * @memberof Component
	 */
	createChild(parentEl, component, data) {
		const factory = this.factoryService.getFactory(component);
		return factory.create(this, data, {parentEl});
	}
}
