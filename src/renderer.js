const express = require('express');
const eta = require('eta');

class Renderer
{
    constructor()
    {
        this._staticDirs = [];
        this._viewDir = null;
    }

    start(app)
    {
        // Initialise View Engine
        app.engine('eta', eta.renderFile);
        app.set('view engine', 'eta');
        app.set('views', this._viewDir);

        // Mount Static Directories
        for (const path of this.getStaticDirs())
        {
            if (path.mountDir === null)
            {
                app.use(express.static(path.path));
            }
            else
            {
                app.use(path.mountDir, express.static(path.path));
            }
        }
    }

    static(path, mountDir = null)
    {
        this._staticDirs.push({
            path,
            mountDir
        });
    }

    getStaticDirs()
    {
        return this._staticDirs;
    }

    setViewDir(viewDir)
    {
        this._viewDir = viewDir;
    }
}

module.exports = new Renderer();
