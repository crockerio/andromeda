const express = require('express');
const eta = require('eta');

const app = express();
const port = 3000;

let server;

module.exports = {
    start()
    {
        const router = require('./router');
        const renderer = require('./renderer');

        renderer.start(app);

        app.use(router.getRouter());

        server = app.listen(port, () => {
            console.log(`App listening at http://localhost:${port}`);
        });
    },
    close()
    {
        if (server !== undefined)
        {
            server.close();
            server = undefined;
        }
    },
    getApp()
    {
        return app;
    },
    getServer()
    {
        return server;
    }
};
