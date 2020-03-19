const express = require('express');
const https = require('https');
const Datastore = require('nedb');

const app = express();
const port = process.env.PORT || 8443;

app.listen(port, () => {
  console.log(`Starting server at ${port}...`);
});

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/all', (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
      res.end();
      return;
    }

    res.json(data);
  });
});

app.post('/location', (req, res) => {
    const data = req.body;
    const timestamp = Date.now();

    data.timestamp  = timestamp;

    database.insert(data);

    res.json(data);
});
