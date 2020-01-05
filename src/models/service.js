import {Instance} from './instance';

export class Service extends Instance {
	constructor(factoryService) {
		super(factoryService);

		this.load();
	}
}
