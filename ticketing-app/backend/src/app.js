const express = require('express');
const eventRoutes = require('./eventRoutes');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/events', eventRoutes);

module.exports = app;
