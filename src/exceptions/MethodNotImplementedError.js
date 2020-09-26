/**
 * Method Not Implemented Error.
 */
class MethodNotImplementedError extends Error
{
    /**
     * Streamline the stack trace.
     * 
     * @param  {...any} args the arguments.
     */
    constructor(...args) {
        super(...args)
        Error.captureStackTrace(this, MethodNotImplementedError)
    }
}

module.exports = MethodNotImplementedError;
