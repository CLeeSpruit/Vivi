import {Service} from '../models/service';
import {getElNameFromComponent} from '../helpers/get-el-name-from-component';
import {conditional, applyWithContext} from '../helpers/eval';
import {Component} from '../models';
/**
 * The magic behind injecting javascript into html code. Parse is the main entry point.
 *
 * @class Engine
 * @augments {Service}
 */
export class Engine extends Service {
	/**
	 * Load assigns attributeBlack list
	 *
	 * @memberof Engine
	 */
	load() {
		this.attributeBlackList = [
			'v-class',
			'v-each',
			'v-if',
			'v-innerhtml',
			'vif-innerhtml',
			'vif-class'
		];
	}

	/**
	 * Parses a given HTML node.
	 * Because node is passed in by reference, this does not return a value.
	 *
	 * @param {Node} node - Node to be parsed
	 * @param {*} data - Data object from parent component
	 * @param {Component} comp - Parent component
	 * @memberof Engine
	 */
	parse(node, data, comp) {
		// Get a list of all unique attributes
		const attributes = this.buildAttributeList(node);
		attributes.forEach(attr => {
			if (attr.startsWith('v-') && !this.attributeBlackList.find(bl => bl === attr)) {
				this.attributeParse(node, data, attr);
			}

			if (attr.startsWith('vif-') && !this.attributeBlackList.find(bl => bl === attr)) {
				this.attributeParseVif(node, data, attr);
			}
		});

		// Parse blacklist items

		// Classes
		this.attributeParse(node, data, 'v-class', (name, el, attr) => {
			const list = attr.split(' ');
			const parsed = list.map(li => {
				// Allow for data and non-data strings
				return applyWithContext(li, data);
			});
			el.classList.add(...parsed);
		});

		// InnerHTML (not actually an attribute, but a property)
		this.attributeParse(node, data, 'v-innerHTML', (name, el, attr) => {
			// Simple replace
			el.innerHTML = applyWithContext(attr, data);
		});

		// V-each
		this.attributeParse(node, data, 'v-each', (name, el, attr) => {
			// Parse v-each="this.children as SomeComponent"
			const match = attr.match(/(.*) as (\w*)/);
			if (match && match.length > 2) {
				const key = match[1];
				const componentName = match[2];
				const arr = applyWithContext(key, data);
				if (arr.forEach) {
					arr.forEach(item => {
						const factory = this.vivi.getFactory(componentName);
						factory.create(comp, item, {parentEl: el, doNotLoad: true});
					});
				}
			}
		});

		// V-if
		this.attributeParse(node, data, 'v-if', (name, el, attr) => {
			if (!conditional(attr, data)) {
				el.remove();
			}
		});

		this.attributeParseVif(node, data, 'vif-class', (name, el, attr) => {
			const list = attr.split(' ');
			const parsed = list.map(li => {
				// Allow for data and non-data strings
				return applyWithContext(li, data);
			});
			el.classList.add(...parsed);
		});

		this.attributeParseVif(node, data, 'vif-innerHTML', (name, el, attr) => {
			el.innerHTML = applyWithContext(attr, data);
		});

		// Parsing Elements
		this.vivi.getComponentRegistry().forEach(reg => {
			// Strip 'Component' off of name
			const name = getElNameFromComponent(reg);
			const els = node.querySelectorAll(name);
			for (let i = 0; i < els.length; i++) {
				const el = els.item(i);
				if (!el.id) {
					const factory = this.vivi.getFactory(reg);
					factory.create(comp, (el).dataset, {parentEl: el.parentElement, replaceEl: el, doNotLoad: true});
				}
			}
		});
	}

	/**
	 * Recursively searches the node for all attributes
	 *
	 * @param {HTMLElement} node - Node to search in
	 * @param {Set<string>} [attributes] - Attribute list
	 * @returns {Set<string>} - All unique attributes in the node
	 * @memberof Engine
	 */
	buildAttributeList(node, attributes) {
		attributes = attributes || new Set();
		const attr = node.attributes;
		if (attr) {
			for (let i = 0; i < attr.length; i++) {
				attributes.add(attr.item(i).name);
			}
		}

		node.childNodes.forEach(child => {
			this.buildAttributeList(child, attributes);
		});

		return attributes;
	}

	/**
	 * Searches the element for a single attribute to format
	 *
	 * @param {HTMLElement} el - Element to search
	 * @param {*} data - context data
	 * @param {string} name - name of attribute to search for
	 * @param {Function} [customParseFn] - If it's more than a simple replacement, run this function if found
	 * @memberof Engine
	 */
	attributeParse(el, data, name, customParseFn) {
		el.querySelectorAll('[' + name + ']').forEach(el => {
			const attr = el.getAttribute(name);

			if (customParseFn) {
				customParseFn(name, el, attr);
			} else {
				// Simple replace
				const newAttribute = name.replace('v-', '');
				el.setAttribute(newAttribute, applyWithContext(attr, data));
			}

			// Rename to data to make parseable
			el.setAttribute('data-' + name, attr);
			el.removeAttribute(name);
		});
	}

	/**
	 * Wraps attribute parse for vif statements
	 *
	 * @param {HTMLElement} node - Element to search
	 * @param {*} data - context data
	 * @param {string} name - name of attribute to search for
	 * @param {Function} customParseFn - If it's more than a simple replacement, run this function if found
	 * @memberof Engine
	 */
	attributeParseVif(node, data, name, customParseFn) {
		this.attributeParse(node, data, name, (attrName, el, attr) => {
			// Match against (conditional) ? trueResult : falseResult
			const match = attr.match(/(?<=\()(.*?)(?=\)\s*\?).*?(?<=\?)\s?(.*)/);
			if (match && match.length > 1) {
				const ternary = attr.match(/(?<=\()(.*?)(?=\)\s*\?).*?(?<=\?)\s?(.*?)\s?:\s?(.*)/);
				let result = null;
				if (ternary && ternary.length > 3) {
					result = conditional(match[1], data) ? ternary[2] : ternary[3];
				} else {
					result = conditional(match[1], data) ? match[2] || null : null;
				}

				// Do not bother setting if there's no result
				if (result === null) {
					return;
				}

				if (customParseFn) {
					customParseFn(name, el, result);
				} else {
					const newAttribute = name.replace('vif-', '');
					el.setAttribute(newAttribute, applyWithContext(result, data));
				}
			}
		});
	}
}
