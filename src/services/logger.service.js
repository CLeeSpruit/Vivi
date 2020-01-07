import {Service} from '../models/service';

/**
 * Logs various levels of errors
 *
 * @class LoggerService
 * @augments {Service}
 */
export class LoggerService extends Service {
	/**
	 * Log message as error
	 * Levels: error, warn, info, verbose
	 * Is on by default
	 *
	 * @param {string} error - Message to user
	 * @param {Array<{key: string, value: *}>} [context] - Contextual parameters
	 * @memberof LoggerService
	 */
	logError(error, context) {
		const {log} = this.vivi.options.log;
		if (log === 'none') {
			return;
		}

		console.error(error);
		this.printContext(context);

		console.trace();
	}

	/**
	 * Log message as warning
	 * Levels: warn, info, verbose
	 * Is on by default
	 *
	 * @param {string} warn - Message to user
	 * @param {Array<{key: string, value: *}>} [context] - Contextual parameters
	 * @memberof LoggerService
	 */
	logWarning(warn, context) {
		const {log} = this.vivi.options.log;
		if (log === 'none' || log === 'error') {
			return;
		}

		console.warn(warn);
		this.printContext(context);
		console.trace();
	}

	/**
	 * Log message
	 * Levels: info, verbose
	 * Is NOT on by default
	 *
	 * @param {string} message - Message to user
	 * @param {Array<{key: string, value: *}>} [context] - Contextual parameters
	 * @param {boolean} [sendTrace] - Add a console trace after log message.
	 * @memberof LoggerService
	 */
	log(message, context, sendTrace) {
		const {log} = this.vivi.options.log;
		if (log === 'info' || log === 'verbose') {
			console.info(message);
			this.printContext(context);

			if (sendTrace) {
				console.trace();
			}
		}
	}

	/**
	 * Log debugging message
	 * Levels: verbose
	 * Is NOT on by default
	 *
	 * @param {string} message - Message to user
	 * @param {Array<{key: string, value: *}>} [context] - Contextual parameters
	 * @memberof LoggerService
	 */
	debug(message, context) {
		const {log} = this.vivi.options.log;
		if (log === 'verbose') {
			console.log(message);
		}

		this.printContext(context);
	}

	/**
	 * Outputs context to log
	 *
	 * @param {Array<{key: string, value: *}>} [context] - Key/Value to output to console
	 * @private
	 * @memberof LoggerService
	 */
	printContext(context) {
		if (context) {
			context.forEach(ct => {
				console.log(ct.key, ct.value);
			});
		}
	}
}
