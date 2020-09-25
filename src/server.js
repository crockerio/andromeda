const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

const staticPath = path.join(__dirname, 'public');
app.use('/static', express.static(staticPath));
console.log(`Mapped /static to ${staticPath}`);

app.get('/', async (req, res) => {
    res.send('Hello World!');
});

module.exports = {
    start()
    {
        app.listen(port, () => {
            console.log(`App listening at http://localhost:${port}`);
        });
    }
};
