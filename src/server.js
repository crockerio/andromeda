const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

const staticPath = path.join(__dirname, 'public');
app.use('/static', express.static(staticPath));
console.log(`Mapped /static to ${staticPath}`);

let server;

module.exports = {
    start()
    {
        const router = require('./router');

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
