/**
 * Invalid Argument Error.
 */
class InvalidArgumentError extends Error
{
    /**
     * Streamline the stack trace.
     * 
     * @param  {...any} args the arguments.
     */
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, InvalidArgumentError);
    }
}

module.exports = InvalidArgumentError;
