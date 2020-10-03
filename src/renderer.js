const express = require('express');

class Renderer
{
    constructor()
    {
        this._staticDirs = [];
    }

    start(app)
    {
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
}

module.exports = new Renderer();
