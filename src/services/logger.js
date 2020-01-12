import {Service} from '../models/service';

/**
 * Logs various levels of errors
 *
 * @class Logger
 * @augments {Service}
 */
export class Logger extends Service {
	/**
	 * Log message as error
	 * Levels: error, warn, info, verbose
	 * Is on by default
	 *
	 * @param {string} error - Message to user
	 * @param {Array<{key: string, value: *}>} [context] - Contextual parameters
	 * @memberof Logger
	 */
	error(error, context) {
		const level = this.vivi.options.log;
		if (level === 'none') {
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
	 * @memberof Logger
	 */
	warn(warn, context) {
		const level = this.vivi.options.log;
		if (level === 'none' || level === 'error') {
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
	 * @memberof Logger
	 */
	info(message, context, sendTrace) {
		const level = this.vivi.options.log;
		if (level === 'info' || level === 'verbose') {
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
	 * @memberof Logger
	 */
	debug(message, context) {
		const level = this.vivi.options.log;
		if (level === 'verbose') {
			console.log(message);
		}

		this.printContext(context);
	}

	/**
	 * Outputs context to log
	 *
	 * @param {Array<{key: string, value: *}>} [context] - Key/Value to output to console
	 * @private
	 * @memberof Logger
	 */
	printContext(context) {
		if (context) {
			context.forEach(ct => {
				console.log(ct.key, ct.value);
			});
		}
	}
}
