/**
 * Wraps the require function to fail gracefully if the module is not found.
 *
 * @param {string} path - Path to module
 * @returns {*} - Will return required module like require(). Returns null if not found.
 */
export function requireOptional(path) {
	try {
		return require(path);
	} catch (error) {
		// A vaild error, throw it back out to sea
		if (error.code !== 'MODULE_NOT_FOUND') {
			throw error;
		}

		// File not found, return null
		return null;
	}
}
