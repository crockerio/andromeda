const MethodNotImplementedError = require('../errors/MethodNotImplementedError');

class Middleware
{
    handle(req, res, next)
    {
        throw new MethodNotImplementedError();
    }
}

module.exports = Middleware;
