/**
 *Evaluates a string condition with a context
 *
 * @export
 * @param {string} condition
 * @param {*} context
 * @returns {boolean}
 */
export function conditional(condition, context) {
	return (function (condition) {
		// Someone grab the holy water, we're going in
		try {
			return eval(condition); // eslint-disable-line no-eval
		} catch {
			return false;
		}
	}).call(context, condition);
}

/**
 *Evaluates a value with context
 *
 * @export
 * @param {*} value
 * @param {*} context
 * @returns Value withing context or value itself if eval fails
 */
export function applyWithContext(value, context) {
	return (function (value) {
		try {
			return eval(value); // eslint-disable-line no-eval
		} catch {
			return value;
		}
	}).call(context, value);
}
