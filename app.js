var express = require('express');
var bodyParser = require('body-parser');
var route = require('./routes/route');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', route);

const PORT = process.env.PORT || 1234
app.listen(PORT, () => { console.log(`Server running at port ${PORT}`)});

module.exports = app;