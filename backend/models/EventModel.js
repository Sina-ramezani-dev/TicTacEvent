const pool = require("../db");

class EventModel {
  async createEvent(data) {
    const {
      title,
      location,
      date,
      startTime,
      endTime,
      price,
      free,
      participants,
      coordinates,
      imageUrl,
    } = data;

    const result = await pool.query(
      `INSERT INTO events (title, location, date, start_time, end_time, price, free, participants, coordinates, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [title, location, date, startTime, endTime, price, free, participants, coordinates, imageUrl]
    );

    return result.rows[0];
  }

  async getAllEvents() {
    const result = await pool.query("SELECT * FROM events ORDER BY date DESC");
    return result.rows;
  }

  async deleteById(id) {
  const result = await pool.query("DELETE FROM events WHERE id = $1", [id]);
  return result.rowCount > 0;
}


  async getEventById(id) {
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
    return result.rows[0];
  }
}

module.exports = new EventModel();
