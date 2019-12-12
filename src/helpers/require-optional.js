export function RequireOptional(path) {
    try {
        return require(path);
    } catch (e) {
        // A vaild error, throw it back out to sea
        if (e.code !== 'MODULE_NOT_FOUND') {
            throw e;
        }
        // File not found, return null
        return null;
    }
}