const path = require('path');
const morgan = require('morgan');
const express = require('express');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

const routes = require('./routes');
const db = require('./config/db');

// Connect DB
db.connect();

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

// HTTP logger
app.use(morgan('combined'));

// Template engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
        },
    }),
);

app.get('/middle-ware', 
    function (req, res, next) {
        if(req.query.ve === 'vip') {
            return next();
        }
        res.status(403).json({ message: 'Access denied'})

    },
    function(req, res, next) {
        res.json({ message: 'Access successful'})
})

app.use(methodOverride('_method'));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

routes(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
