const express = require('express');
const https = require('https');
const Datastore = require('nedb');

const app = express();
const server = https.createServer(app);
const port = process.env.PORT || 8443;

server.listen(port, () => {
  console.log(`Starting server at ${port}...`);
});

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

server.get('/all', (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
      res.end();
      return;
    }

    res.json(data);
  });
});

server.post('/location', (req, res) => {
    const data = req.body;
    const timestamp = Date.now();

    data.timestamp  = timestamp;

    database.insert(data);

    res.json(data);
});
