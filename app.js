const express = require('express');
const app = express();
const path = require('path');
const logger = require('./middleware/logger');
const requestController = require('./routes/requestController');
const cors = require('cors');
const model = require('./model')

const port = process.env.PORT || 8080;

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Logger Middleware
app.use(logger);

// Use CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Routes
app.use('/', requestController);

// Set static folder
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'client/build', 'index.html'))
});

app.listen(port, () => {
    console.log("Server listening on " + port + ".")
});

model.loadExampleData()