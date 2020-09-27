module.exports = {
    route(name)
    {
        const NamedRouteNotFoundError = require('./errors/NamedRouteNotFoundError');
        const router = require('./router');
        if (!router.getRouteMap().has(name))
        {
            throw new NamedRouteNotFoundError();
        }

        return router.getRouteMap().get(name);
    }
};
