/**
 * Generic instance of code. Base class for services and components.
 *
 * @class Instance
 */
export class Instance {
	constructor(vivi) {
		this.vivi = vivi;
	}

	/**
	 * Assigns id, data, and sets any prereqs that are needed before loading
	 *
	 * @param {number} id - Id # of instance
	 * @param {*} [data] - Data to be passed to instance
	 * @memberof Instance
	 */
	setData(id, data) {
		this.data = data || {};
		this.id = `${this.constructor.name}-${id}`;
	}

	/**
	 * Creates a listener that waits for an application event to fire to trigger callback
	 *
	 * @param {string} eventName - Custom name of event. Will fire event when eventName matches
	 * @param {Function} cb - Function to call when event fires
	 * @memberof Component
	 */
	appListen(eventName, cb) {
		this.vivi.get('AppEvent').createListener(eventName, cb.bind(this));
	}

	/**
	 * Sends an application event to fire
	 *
	 * @param {string} eventName - Custom name of event. Something must listen to this before firing in order to trigger.
	 * @param {Object} data - Optional data to send along event
	 * @memberof Component
	 */
	sendEvent(eventName, data) {
		this.vivi.get('AppEvent').sendEvent(eventName, data);
	}

	/**
	 * Placeholder for load hook function. If a component, will run after DOM loads. If service, will run after constructor.
	 *
	 * @memberof Instance
	 */
	load() {}

	/**
	 * Placeholder for destroy hook function.
	 *
	 * @memberof Instance
	 */
	destroy() {}
}
