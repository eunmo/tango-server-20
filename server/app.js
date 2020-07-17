const express = require('express');
const path = require('path');

const routes = require('./routes');

const app = express();

// Serve static assets
app.use(express.static(path.join(__dirname, '../build')));

app.use('/api', routes);

app.get('*', (req, res) => {
  res.sendFile(path.resolve('build', 'index.html'));
});

module.exports = app;
