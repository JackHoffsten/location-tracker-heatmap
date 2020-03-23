const express = require('express');
const Datastore = require('nedb');
const https = require('https');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 443;

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

const httpsOptions = {
  key: fs.readFileSync('location-tracker-heatmap/ssl/key.pem'),
  cert: fs.readFileSync('location-tracker-heatmap/ssl/cert.pem'),
};

https.createServer(httpsOptions, app).listen(port, () => {
  console.log(`Starting server at ${port}...`);
});
