const assert = require('assert');
const Controller = require('../src/http/Controller');
const InvalidArgumentError = require('../src/exceptions/InvalidArgumentError');
const router = require('../src/router');

class TestController extends Controller {}

describe('router', () => {
    afterEach(() => {
        router.reset();
    });

    describe('_getLastSegment()', () => {
        it('parses single words with no slashes', () => {
            const output = router._getLastSegment('test');
            assert.strictEqual(output,  'test');
        });

        it('parses single words with leading slash', () => {
            const output = router._getLastSegment('/test');
            assert.strictEqual(output,  'test');
        });

        it('parses single words with trailing slash', () => {
            const output = router._getLastSegment('test/');
            assert.strictEqual(output,  'test');
        });

        it('parses single words with leading and trailing slashes', () => {
            const output = router._getLastSegment('/test/');
            assert.strictEqual(output,  'test');
        });

        it('parses multi-segment paths without leading or trailing slashes', () => {
            const output = router._getLastSegment('root/test');
            assert.strictEqual(output,  'test');
        });

        it('parses multi-segment paths with leading slash', () => {
            const output = router._getLastSegment('/root/test');
            assert.strictEqual(output,  'test');
        });

        it('parses multi-segment paths with trailing slash', () => {
            const output = router._getLastSegment('root/test/');
            assert.strictEqual(output,  'test');
        });

        it('parses multi-segment paths with leading and trailing slashes', () => {
            const output = router._getLastSegment('/root/test/');
            assert.strictEqual(output,  'test');
        });

        it('handles empty input', () => {
            assert.throws(() => {
                router._getLastSegment('');    
            }, InvalidArgumentError);
        });
    });


    describe('_getRouteName()', () => {
        it('creates a name for a single word route', () => {
            const name = router._getRouteName('test');
            assert.strictEqual(name, 'test');
        });

        it('creates a name for a single word route, ignoring leading slash', () => {
            const name = router._getRouteName('/test');
            assert.strictEqual(name, 'test');
        });

        it('creates a name for a single word route, ignoring trailing slash', () => {
            const name = router._getRouteName('test/');
            assert.strictEqual(name, 'test');
        });

        it('creates a name for a single word route, ignoring leading and trailing slashes', () => {
            const name = router._getRouteName('/test/');
            assert.strictEqual(name, 'test');
        });

        it('creates a name for a multi-word route', () => {
            const name = router._getRouteName('test/route');
            assert.strictEqual(name, 'test.route');
        });

        it('creates a name for a multi-word route, ignoring leading slash', () => {
            const name = router._getRouteName('/test/route');
            assert.strictEqual(name, 'test.route');
        });

        it('creates a name for a multi-word route, ignoring trailing slash', () => {
            const name = router._getRouteName('test/route/');
            assert.strictEqual(name, 'test.route');
        });

        it('creates a name for a multi-word route, ignoring leading and trailing slashes', () => {
            const name = router._getRouteName('/test/route/');
            assert.strictEqual(name, 'test.route');
        });

        it('ignores params at the start', () => {
            const name = router._getRouteName('/:param/test/route/');
            assert.strictEqual(name, 'test.route');
        });

        it('ignores params in the middle', () => {
            const name = router._getRouteName('/test/:param/route/');
            assert.strictEqual(name, 'test.route');
        });

        it('ignores params at the end', () => {
            const name = router._getRouteName('/test/route/:param/');
            assert.strictEqual(name, 'test.route');
        });
    });

    describe('_getDefaultResourceNames()', () => {
        it('gets the default route names', () => {
            const expected = {
                index: 'users.index',
                create: 'users.create',
                store: 'users.store',
                show: 'users.show',
                edit: 'users.edit',
                update: 'users.update',
                destroy: 'users.destroy',
            };

            assert.deepStrictEqual(router._getDefaultResourceNames('users'), expected);
        });

        it('can override some names', () => {
            const expected = {
                index: 'test.index',
                create: 'users.create',
                store: 'users.store',
                show: 'users.show',
                edit: 'users.edit',
                update: 'users.update',
                destroy: 'test.destroy',
            };

            const overrides = {
                index: 'test.index',
                destroy: 'test.destroy'
            };

            assert.deepStrictEqual(router._getDefaultResourceNames('users', overrides), expected);
        });
    });

    describe('resource route creation', () => {
        it('names the routes for the resource controller', () => {
            const expectedMap = new Map();
            expectedMap.set('users.index', 'users');
            expectedMap.set('users.create', 'users/create');
            expectedMap.set('users.store', 'users');
            expectedMap.set('users.show', 'users/:user');
            expectedMap.set('users.edit', 'users/:user/edit');
            expectedMap.set('users.update', 'users/:user');
            expectedMap.set('users.destroy', 'users/:user');

            router.resource('users', new TestController());

            assert.strictEqual(router._nameRouteMap.size, 7);
            assert.deepStrictEqual(router._nameRouteMap, expectedMap);
        });

        it('can manually name resource routes', () => {
            const expectedMap = new Map();
            expectedMap.set('test.index', 'users');
            expectedMap.set('users.create', 'users/create');
            expectedMap.set('test.store', 'users');
            expectedMap.set('users.show', 'users/:user');
            expectedMap.set('users.edit', 'users/:user/edit');
            expectedMap.set('users.update', 'users/:user');
            expectedMap.set('test.destroy', 'users/:user');

            router.resource('users', new TestController(), {
                index: 'test.index',
                store: 'test.store',
                destroy: 'test.destroy',
            });

            assert.strictEqual(router._nameRouteMap.size, 7);
            assert.deepStrictEqual(router._nameRouteMap, expectedMap);
        });
    });

    describe('manual route creation', () => {
        it('can automatically name GET requests', () => {
            router.get('/endpoint', () => {});

            assert.strictEqual(router._nameRouteMap.size, 1);
            assert.strictEqual(router._nameRouteMap.has('endpoint'), true);
        });

        it('can automatically name POST requests', () => {
            router.post('/endpoint', () => {});

            assert.strictEqual(router._nameRouteMap.size, 1);
            assert.strictEqual(router._nameRouteMap.has('endpoint'), true);
        });

        it('can automatically name PUT requests', () => {
            router.put('/endpoint', () => {});

            assert.strictEqual(router._nameRouteMap.size, 1);
            assert.strictEqual(router._nameRouteMap.has('endpoint'), true);
        });

        it('can automatically name PATCH requests', () => {
            router.patch('/endpoint', () => {});

            assert.strictEqual(router._nameRouteMap.size, 1);
            assert.strictEqual(router._nameRouteMap.has('endpoint'), true);
        });

        it('can automatically name DELETE requests', () => {
            router.delete('/endpoint', () => {});

            assert.strictEqual(router._nameRouteMap.size, 1);
            assert.strictEqual(router._nameRouteMap.has('endpoint'), true);
        });

        it('can manually name GET requests', () => {
            router.get('/endpoint', () => {}, 'custom.name');

            assert.strictEqual(router._nameRouteMap.size, 1);
            assert.strictEqual(router._nameRouteMap.has('custom.name'), true);
        });

        it('can manually name POST requests', () => {
            router.post('/endpoint', () => {}, 'custom.name');

            assert.strictEqual(router._nameRouteMap.size, 1);
            assert.strictEqual(router._nameRouteMap.has('custom.name'), true);
        });

        it('can manually name PUT requests', () => {
            router.put('/endpoint', () => {}, 'custom.name');

            assert.strictEqual(router._nameRouteMap.size, 1);
            assert.strictEqual(router._nameRouteMap.has('custom.name'), true);
        });

        it('can manually name PATCH requests', () => {
            router.patch('/endpoint', () => {}, 'custom.name');

            assert.strictEqual(router._nameRouteMap.size, 1);
            assert.strictEqual(router._nameRouteMap.has('custom.name'), true);
        });

        it('can manually name DELETE requests', () => {
            router.delete('/endpoint', () => {}, 'custom.name');

            assert.strictEqual(router._nameRouteMap.size, 1);
            assert.strictEqual(router._nameRouteMap.has('custom.name'), true);
        });
    });

    describe('http tests', () => {
        const request = require('supertest');
        let server;

        beforeEach(() => {
            delete require.cache[require.resolve('../src/server')];
            server = require('../src/server');
        });
    
        afterEach(() => {
            server.close();
        });


        it.skip('it can create a route', (done) => {
            router.get('/endpoint', (req, res) => { res.send('Success'); });
            assert.strictEqual(router._nameRouteMap.size, 1);

            server.start();
            request(server.getServer())
                .get('/endpoint')
                .expect(200, done);
        });

        it.skip('can reset the router instance', (done) => {
            assert.strictEqual(router._nameRouteMap.size, 0);
            router.get('/endpoint', (req, res) => { res.send('Success'); });
            assert.strictEqual(router._nameRouteMap.size, 1);
            
            router.reset();
            assert.strictEqual(router._nameRouteMap.size, 0);

            server.start();
            request(server.getServer())
                .get('/endpoint')
                .expect(404, done);
        });

        it('can take a middleware function', (done) => {
            let middlewareCalled = false;

            router.registerMiddleware((req, res, next) => {
                middlewareCalled = true;
                next();
            });

            router.get('/endpoint', (req, res) => { res.send('Success'); });
            server.start();
            request(server.getServer())
                .get('/endpoint')
                .expect(200, () => {
                    assert.strictEqual(middlewareCalled, true);
                    done();
                });
        });
    });
});
