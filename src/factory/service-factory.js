import {Factory} from './factory';

/**
 * Generates and manages components
 *
 * @class ServiceFactory
 * @augments {Factory}
 */
export class ServiceFactory extends Factory {
	constructor(constructorFn, vivi) {
		super(constructorFn, vivi);
		this.create();
	}
}
