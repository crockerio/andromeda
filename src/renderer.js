class Renderer
{
    constructor()
    {
        this._staticDirs = [];
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
