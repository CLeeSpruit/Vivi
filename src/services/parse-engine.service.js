import {Service} from '../models/service';
import {getElNameFromComponent} from '../helpers/get-el-name-from-component';
import {conditional, applyWithContext} from '../helpers/eval';
export class ParseEngineService extends Service {
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
						const factory = this.factoryService.getFactoryByString(componentName);
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
		this.factoryService.module.getComponentRegistry().forEach(reg => {
			// Strip 'Component' off of name
			const name = getElNameFromComponent(reg);
			const els = node.querySelectorAll(name);
			for (let i = 0; i < els.length; i++) {
				const el = els.item(i);
				if (!el.id) {
					const factory = this.factoryService.getFactoryByString(reg);
					factory.create(comp, (el).dataset, {parentEl: el.parentElement, replaceEl: el, doNotLoad: true});
				}
			}
		});
	}

	buildAttributeList(node, attributes = new Set()) {
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
