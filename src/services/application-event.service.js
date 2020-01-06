import {EventRegistry} from '@cspruit/zephyr';
import {Service} from '../models/service';

/**
 * Service that provides an event registry. Essentially a wrapper around Zephyr.
 *
 * @class ApplicationEventService
 * @augments {Service}
 */
export class ApplicationEventService extends Service {
	load() {
		this.eventRegistry = new EventRegistry();
	}

	sendEvent(eventName, data) {
		this.eventRegistry.sendEvent(eventName, data);
	}

	createListener(eventName, callback) {
		return this.eventRegistry.listen(eventName, callback);
	}
}
