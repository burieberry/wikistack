const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
nunjucks.configure('views', { noCache: true });
const db = require('./db');

const app = express();
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

// app.use(require('morgan')('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')('_method'));

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  return db.models.Page.findAll()
    .then(pages => {
      res.render('index', { pages });
    })
    .catch(next);
});

app.use('/wiki', require('./routes/wiki'));
app.use('/users', require('./routes/users'));

app.use((req, res, next) => {
  const error = new Error('Page not found.');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.render('error', { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  db.sync()
    .then(db.seed)
    .then(() => {
      console.log(`Listening on port ${port}.`);
    })
    .catch(console.error);
});
