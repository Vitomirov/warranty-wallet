import db from './db.js'; // Import the db object

db.query('SELECT 1', (err, results) => { // Use db.query
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Successfully connected to MySQL!');
  // No need to close the connection if you are using db.js's connection logic.
});