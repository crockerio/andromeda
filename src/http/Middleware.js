const MethodNotImplementedError = require('../exceptions/MethodNotImplementedError');

class Middleware
{
    handle(req, res, next)
    {
        throw new MethodNotImplementedError();
    }
}

module.exports = Middleware;
