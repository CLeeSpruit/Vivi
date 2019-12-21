import {EventRegistry} from '@cspruit/zephyr';
import {Service} from '../models/service';

export class ApplicationEventService extends Service {
	constructor() {
		super();
		this.eventRegistry = new EventRegistry();
	}

	sendEvent(eventName, data) {
		this.eventRegistry.sendEvent(eventName, data);
	}

	createListener(eventName, callback) {
		return this.eventRegistry.listen(eventName, callback);
	}
}
