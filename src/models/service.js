import {Instance} from './instance';

/**
 * Reusable chunk of code that is often shared between components. Provides additional functionality to components.
 *
 * @class Service
 * @augments {Instance}
 */
export class Service extends Instance {
	constructor(factoryService) {
		super(factoryService);

		this.load();
	}
}
