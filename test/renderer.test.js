const request = require('supertest');
const assert = require('assert');
const path = require('path');
const renderer = require('../src/renderer');

describe('renderer', () => {
    let server;

    beforeEach(() => {
        delete require.cache[require.resolve('../src/server')];
        server = require('../src/server');
    });

    afterEach(() => {
        server.close();
    });

    it('can set the static directory', (done) => {
        renderer.static(path.join(__dirname, 'res/static'));

        server.start();
        request(server.getServer())
            .get('/test.txt')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.text, 'Static Text File\n');
                done();
            });
    });

    it('can mount multiple static dirs', (done) => {
        renderer.static(path.join(__dirname, 'res/static'));
        renderer.static(path.join(__dirname, 'res/static2'));

        server.start();
        request(server.getServer())
            .get('/test.txt')
            .expect(200)
            .then((res) => {
                assert.strictEqual(res.text, 'Static Text File\n');
            })
            .then(() => {
                request(server.getServer())
                    .get('/test2.txt')
                    .expect(200)
                    .then((res) => {
                        assert.strictEqual(res.text, 'Static 2 Text File\n');
                        done();
                    });
            });

    });

    it('can mount a static dir to a subdirectory', (done) => {
        renderer.static(path.join(__dirname, 'res/static'), '/sub/dir');

        server.start();
        request(server.getServer())
            .get('/sub/dir/test.txt')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.text, 'Static Text File\n');
                done();
            });
    });
});
