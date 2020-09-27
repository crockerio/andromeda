const assert = require('assert');
const utils = require('../src/utils');

describe('utils', () => {
    describe('route', () => {
        const router = require('../src/router');
        const NamedRouteNotFoundError = require('../src/errors/NamedRouteNotFoundError');

        afterEach(() => {
            router.reset();
        });

        it('can retrieve a named route', () => {
            router.get('test/route', (req, res) => { res.send('Success!'); });
            assert.strictEqual(utils.route('test.route'), 'test/route');
        });

        it('throws an error if the route doesn\'t exist', () => {
            assert.throws(() => {
                utils.route('test.route');
            }, NamedRouteNotFoundError);
        });
    });
});
