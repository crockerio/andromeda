const path = require('path');
const pluralize = require('pluralize');
const express = require('express');
const Controller = require('./http/Controller');
const InvalidArgumentError = require('./exceptions/InvalidArgumentError');

/**
 * Router.
 * 
 * Registers routes within the application.
 * Deals with route-name binding.
 */
class Router 
{
    /**
     * Initialise the Router.
     */
    constructor()
    {
        this._router = express.Router();
        this._nameRouteMap = new Map();
    }

    _getLastSegment(url)
    {
        if (url.length === 0)
        {
            throw new InvalidArgumentError('`url` cannot be blank');
        }

        const segments = url.split('/');

        for (let i = segments.length - 1; i >= 0; i--)
        {
            const segment = segments[i];

            if (segment.length > 0)
            {
                return segment;
            }
        }
    }

    _getRouteName(url)
    {
        const segments = url.split('/').filter(segment => segment.length > 0 && !segment.startsWith(':'));
        return segments.join('.');
    }

    _getDefaultResourceNames(prefix, overrideNames = {})
    {
        const routeNames = {
            index: `${prefix}.index`,
            create: `${prefix}.create`,
            store: `${prefix}.store`,
            show: `${prefix}.show`,
            edit: `${prefix}.edit`,
            update: `${prefix}.update`,
            destroy: `${prefix}.destroy`,
        };

        for (const key in overrideNames)
        {
            routeNames[key] = overrideNames[key];
        }

        return routeNames;
    }

    getRouteMap()
    {
        return this._nameRouteMap;
    }

    get(url, fn, name = undefined)
    {
        if (name === undefined)
        {
            name = this._getRouteName(url);
        }

        this._nameRouteMap.set(name, url);
        this._router.get(url, fn);
    }

    post(url, fn, name = undefined)
    {
        if (name === undefined)
        {
            name = this._getRouteName(url);
        }

        this._nameRouteMap.set(name, url);
        this._router.post(url, fn);
    }

    put(url, fn, name = undefined)
    {
        if (name === undefined)
        {
            name = this._getRouteName(url);
        }

        this._nameRouteMap.set(name, url);
        this._router.put(url, fn);
    }

    patch(url, fn, name = undefined)
    {
        if (name === undefined)
        {
            name = this._getRouteName(url);
        }

        this._nameRouteMap.set(name, url);
        this._router.patch(url, fn);
    }

    delete(url, fn, name = undefined)
    {
        if (name === undefined)
        {
            name = this._getRouteName(url);
        }

        this._nameRouteMap.set(name, url);
        this._router.delete(url, fn);
    }

    /**
     * Create all routes for a given resource.
     * 
     * @param {string} baseUrl 
     * @param {Controller} controller 
     */
    resource(baseUrl, controller, overrideNames = {})
    {
        if (!(controller instanceof Controller))
        {
            throw new InvalidArgumentError('controller must be of type Controller');
        }

        const namePrefix = this._getLastSegment(baseUrl);
        const param = pluralize.singular(namePrefix);

        const defaultNames = this._getDefaultResourceNames(namePrefix, overrideNames);

        const createUrl = path.join(baseUrl, 'create');
        const showUrl = path.join(baseUrl, `:${param}`);
        const editUrl = path.join(baseUrl, `:${param}`, 'edit');

        this.get(baseUrl, controller.index, defaultNames.index);
        this.get(createUrl, controller.create, defaultNames.create);
        this.post(baseUrl, controller.store, defaultNames.store);
        this.get(showUrl, controller.show, defaultNames.show);
        this.get(editUrl, controller.edit, defaultNames.edit);
        this.put(showUrl, controller.update, defaultNames.update);
        this.patch(showUrl, controller.update, defaultNames.update);
        this.delete(showUrl, controller.destroy, defaultNames.destroy);
    }

    getRouter()
    {
        return this._router;
    }

    reset()
    {
        this._nameRouteMap.clear();
        this._router.routes = {};
    }
}

module.exports = new Router();
