const express = require('express');

const app = express();
const port = 3000;

let server;

module.exports = {
    start()
    {
        const router = require('./router');
        const renderer = require('./renderer');

        for (const path of renderer.getStaticDirs())
        {
            console.info(`Static path: ${path}`);

            if (path.mountDir === null)
            {
                app.use(express.static(path.path));
            }
            else
            {
                app.use(path.mountDir, express.static(path.path));
            }
        }

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
