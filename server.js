const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const env = nunjucks.configure('views', { noCache: true });

const app = express();
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use(require('morgan')('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.send('oh hi');
});

app.use((req, res, next) => {
  const error = new Error(`Page ${req.url} not found.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || 'Internal error.');
  next();
});

const port = process.env.PORT || 3000;
const db = require('./db');

app.listen(port, () => {
  db.sync()
    .then(() => {
      console.log(`Listening on port ${port}.`);
    })
    .catch(console.error);
});
