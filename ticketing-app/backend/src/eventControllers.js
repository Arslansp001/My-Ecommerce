const pool = require('./db');

async function initEventsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      event_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function createEvent(req, res) {
  try {
    const { title, location, eventDate } = req.body;

    if (!title || !location || !eventDate) {
      return res.status(400).json({ error: 'title, location, and eventDate are required' });
    }

    const result = await pool.query(
      'INSERT INTO events (title, location, event_date) VALUES ($1, $2, $3) RETURNING *',
      [title, location, eventDate]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getEvents(_req, res) {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY id DESC');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  initEventsTable,
  createEvent,
  getEvents,
};
