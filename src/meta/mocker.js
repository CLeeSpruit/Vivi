import {ModuleFactory} from '../factory/module-factory';
import {MockComponent} from '../models/__mocks__/component.mock';
import {MockService} from '../models/__mocks__/service.mock';
import {NodeTreeService} from '../services/node-tree.service';
import {ComponentFactory} from '../factory/component-factory';

/**
 * Creates a mock instance of Vivi
 *
 * @private
 * @class Mocker
 */
export class Mocker {
	/**
	 *Creates an instance of Mocker.
	 *
	 * @memberof Mocker
	 */
	constructor() {
		this.defaultTemplate = '<span class="test">Test</span>';
		this.defaultStyle = '* { color: red }';
		this.defaultData = {name: 'test'};
		this.module = new ModuleFactory({
			componentConstructors: [MockComponent],
			serviceConstructors: [MockService],
			rootComponent: MockComponent
		});

		this.rootComp = this.getFactory().get();
	}

	/**
	 *Returns ComponentFactory of MockComponent
	 *
	 * @returns {ComponentFactory} - ComponentFactory of MockComponent
	 * @memberof Mocker
	 */
	getFactory() {
		return this.module.getFactory(MockComponent);
	}

	/**
	 *Creates a mock of MockComponent with optional parameters
	 *
	 * @param {*} options - Options for component created
	 * @returns {Component}
	 * @memberof Mocker
	 */
	createMock(options) {
		const comp = this.getFactory().create(this.rootComp);

		if (options.template || options.hasTemplate) {
			comp.template = options.template ? options.template : this.defaultTemplate;
		}

		if (options.style || options.hasStyle) {
			comp.style = options.style ? options.style : this.defaultStyle;

			// Since this is set via the factory and is already in place,
			//     we're going to have to replace the existing version to "fake" the original
			const styleEl = document.createElement('style');
			styleEl.innerHTML = comp.style;
			document.head.append(styleEl);
		}

		if (options.data || options.hasData) {
			comp.data = options.data ? options.data : this.defaultData;
		}

		if (!options.doNotAppend) {
			comp.append(this.rootComp.element, null);

			if (!options.doNotLoad) {
				// Get node
				const nodeTree = this.module.get(NodeTreeService);
				nodeTree.loadComponent(comp);
			}
		}

		// Application needs to be loaded before children can be added
		if (options.children || options.hasChild) {
			if (options.children) {
				options.children.forEach(child => {
					comp.createChild(comp.element, child);
				});
			} else {
				comp.createChild(comp.element, MockComponent);
			}
		}

		return comp;
	}

	clearMocks() {
		const factory = this.getFactory();
		factory.destroyAll();
	}
}
