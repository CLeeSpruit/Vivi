export function RequireOptional(path) {
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
