const request = require('supertest');

describe('server', () => {
    let server;

    beforeEach(() => {
        delete require.cache[require.resolve('../src/server')];
        server = require('../src/server');
        server.getApp().get('/', (req, res) => { res.send('Success'); });
        server.start();
    });

    afterEach(() => {
        server.close();
    });

    it('responds to /', (done) => {
        request(server.getServer())
            .get('/')
            .expect(200, done);
    });

    it('404\'s everything else', (done) => {
        request(server.getServer())
            .get('/some/non-existant/path')
            .expect(404, done);
    });

});
