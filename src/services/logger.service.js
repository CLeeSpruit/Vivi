import {Service} from '../models/service';

/**
 * Logs various levels of errors
 *
 * @class LoggerService
 * @augments {Service}
 */
export class LoggerService extends Service {
	/**
	 * Log message as warning
	 *
	 * @param {string} error - Message to user
	 * @param {Array<{key: string, value: *}>} [context] - Contextual parameters
	 * @memberof LoggerService
	 */
	logError(error, context) {
		console.error(error);
		if (context) {
			context.forEach(ct => {
				console.log(ct.key, ct.value);
			});
		}

		console.trace();
	}

	/**
	 * Log message as warning
	 *
	 * @param {string} warn - Message to user
	 * @memberof LoggerService
	 */
	logWarning(warn) {
		console.warn(warn);
		console.trace();
	}

	/**
	 * Log message
	 *
	 * @param {string} message - Message to user
	 * @param {boolean} sendTrace - Add a console trace after log message
	 * @memberof LoggerService
	 */
	log(message, sendTrace) {
		console.log(message);

		if (sendTrace) {
			console.trace();
		}
	}
}
