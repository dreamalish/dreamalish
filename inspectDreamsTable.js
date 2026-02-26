const { Client } = require('pg');

// Replace this with your Render Postgres URL
const connectionString = 'postgresql://dreamalish_2rmw_user:R0IrLOPZUvXxLCyFgPKEat9PE8xjHagl@dpg-d63523ggjchc73eq4d40-a.ohio-postgres.render.com/dreamalish_2rmw';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }, // Required for Render
});

async function inspectDreams() {
  try {
    await client.connect();
    console.log('Connected to DB ✅');

    // Query for column names and types
    const res = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'Dreams';
    `);

    console.log('Columns in Dreams table:');
    res.rows.forEach(row => console.log(row));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
    console.log('Connection closed');
  }
}

inspectDreams();
