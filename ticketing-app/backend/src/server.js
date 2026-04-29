require('dotenv').config();

const app = require('./app');
const { initEventsTable } = require('./eventControllers');

const port = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await initEventsTable();
    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
