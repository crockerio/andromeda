/**
 * Named Route Not Found Error.
 */
class NamedRouteNotFoundError extends Error
{
    /**
     * Streamline the stack trace.
     * 
     * @param  {...any} args the arguments.
     */
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, NamedRouteNotFoundError);
    }
}

module.exports = NamedRouteNotFoundError;
