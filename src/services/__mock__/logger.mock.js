import {Logger} from '../logger';

export class MockLogger extends Logger {
	/**
	 * Sets the ExecutionContext of the test
	 *
	 * @param {*} t - Execution context from AVA
	 * @memberof MockLogger
	 */
	setTest(t) {
		this.t = t;
	}

	error(message, context) {
		if (this.t) {
			this.t.fail(message);
		} else {
			super.error(message, context);
		}
	}
}
