/**
 * Evaluates a string condition with a context
 *
 * @param {string} condition - Condition to be evaluated
 * @param {*} context - Object to be called with context
 * @returns {boolean} - Result. Will return false if eval fails
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
 * Evaluates a value with context
 *
 * @param {string} value - Value to be evaluated
 * @param {*} context - Object to be called with context
 * @returns {*} - Value within context or value itself if eval fails
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
