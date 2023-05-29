const express = require('express');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'xiangqi',
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database: ', err);
    } else {
      console.log('Connected to MySQL database');
    }
});

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); 
    next();
  });

app.get('/api/endgames/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM endgames WHERE id = ?';
    connection.query(query, [1], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query: ', err);
            res.status(500).json({ error: 'Error executing MySQL query' });
        } else {
            if (results.length > 0) {
                const layout = results[0].arrangement; 
                res.json(layout);
            } else {
                res.status(404).json({ error: 'Endgame not found' });
            }
        }
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

process.on('SIGINT', () => {
    connection.end();
    process.exit();
});
  
