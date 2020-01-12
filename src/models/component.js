import {listen} from '@cspruit/zephyr';
import {getElNameFromComponent} from '../helpers/get-el-name-from-component';
import {Instance} from './instance';

/**
 * Reusable chunk of code that contains template and style data
 *
 * @class Component
 * @augments {Instance}
 */
export class Component extends Instance {
	/**
	 * Sets id, data, prereqs of component.
	 * Grabs appEvents, parseEngine, and nodeTree services
	 * Called By: Factory.create
	 *
	 * @param {number} id - Number to be assigned to component
	 * @param {*} [data] - Data to be passed to the component
	 * @memberof Component
	 */
	setData(id, data) {
		super.setData(id, data);

		// Turns a name like "SearchBarComponent" to look for "search-bar.component.xyz"
		this.componentName = getElNameFromComponent(this.constructor.name);
		this.setFiles();
	}

	/**
	 * Set Template and Style for component. Leave to import from vivi_application/componentName/component-name.component.html/scss
	 * Called By: Component.setData
	 *
	 * @memberof Component
	 * @todo rename to loadFiles
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
	 * Called By: Component.createNodes, Component.redraw
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
	 * Called By: Component.append if it hasn't been called before
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
		this.vivi.get('ParseEngineService').parse(this.parsedNode, this.data, this);
	}

	/**
	 * Appends component to an element
	 * Called By: Factory.create
	 *
	 * @param {HTMLElement} parentEl - Element to append component element to
	 * @param {HTMLElement} [replaceEl] - Element to replace on append. Should be child of parentEl
	 * @memberof Component
	 */
	append(parentEl, replaceEl) {
		if (!parentEl) {
			this.vivi.get('LoggerService').error(`Error while appending ${this.id}. Parent element does not exist.`);
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
	 * Called By: NodeTree.load
	 *
	 * @memberof Component
	 */
	startLoad() {
		// Assign Element
		this.element = document.querySelector('#' + this.id);
		if (!this.element) {
			this.vivi.get('LoggerService').warn(`Error while loading ${this.id}. Element not was not created.`);
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
		if (oldEl && newEl) {
			const parentEl = oldEl.parentElement;
			this.vivi.get('ParseEngineService').parse(newEl, this.data, this);
			parentEl.replaceChild(newEl, oldEl);
			this.parsedNode = newEl;
			this.element = document.querySelector('#' + this.id);
		} else {
			this.vivi.get('LoggerService').error(`Error redrawing component: ${this.id}. Element not found.`,
				[
					{key: 'Component', value: this},
					{key: 'Old Element', value: oldEl},
					{key: 'New Element', value: newEl}
				]
			);
		}
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
		this.vivi.get('ApplicationEventService').createListener(eventName, cb.bind(this));
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
		const factory = this.vivi.getFactory(component);
		return factory.create(this, data, {parentEl});
	}
}
