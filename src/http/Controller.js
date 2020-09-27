const MethodNotImplementedError = require('../errors/MethodNotImplementedError');

class Controller
{
    index()
    {
        throw new MethodNotImplementedError();
    }

    create()
    {
        throw new MethodNotImplementedError();
    }

    store()
    {
        throw new MethodNotImplementedError();
    }

    show()
    {
        throw new MethodNotImplementedError();
    }

    edit()
    {
        throw new MethodNotImplementedError();
    }

    update()
    {
        throw new MethodNotImplementedError();
    }

    destroy()
    {
        throw new MethodNotImplementedError();
    }
}

module.exports = Controller;
