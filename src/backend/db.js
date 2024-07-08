import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'devito', 
  password: 'vitomirov1989',
  database: 'warranty_db', 
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL server');
});

export default connection;
