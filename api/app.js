// load modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const { sequelize } = require('./models');


// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// expose location header
const corsOptions = {
    exposedHeaders: ['Location']
}

// enable all CORS Requests
app.use(cors(corsOptions));

// setup request body JSON parsing
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// mount /api route middleware to app
app.use('/api', apiRoutes);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the REST API project!',
    });
});

// send 404 if no other route matched
app.use((req, res) => {
    res.status(404).json({
        message: 'Route Not Found',
    });
});

// setup a global error handler
app.use((err, req, res, next) => {
    if (enableGlobalErrorLogging) {
        console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
    }

    res.status(err.status || 500).json({
        message: err.message,
        error: {},
    });
});

// set our port
app.set('port', process.env.PORT || 5000);

// test the database connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// start listening on our port
const server = app.listen(app.get('port'), () => {
    console.log(`Express server is listening on port ${server.address().port}`);
});
