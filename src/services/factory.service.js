import {Service} from '../models/service';

export class FactoryService extends Service {
	constructor() {
		super();
		this.module = window.vivi;
	}

	getFactory(con) {
		return this.module.getFactory(con);
	}

	getFactoryByString(name) {
		return this.module.getFactoryByString(name);
	}
}
