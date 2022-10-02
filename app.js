require("dotenv").config();
require("./config/database").connect();
require('./model');

const cors = require('cors');
const busBoy = require('busboy-body-parser');
const path = require('path');

const express = require("express");

const app = express();

app.use(requireHTTPS);
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(busBoy({ limit: '50mb' }));

app.use('/api', require('./routes'));


// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/profile-app'));

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/dist/profile-app/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
      return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

module.exports = app;