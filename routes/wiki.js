const router = require('express').Router();
const db = require('../db');
const Page = db.models.Page,
      User = db.models.User;

router.get('/', (req, res, next) => {
  return Page.findAll()
    .then(pages => {
      res.render('index', { pages });
    })
    .catch(next);
});

router.get('/add', (req, res, next) => {
  res.render('addpage');
});

router.post('/', (req, res, next) => {
  return User.findOrCreateUser(req.body)
    .then(user => {
      return Page.createPage(req.body, user)
        .then(page => {
          res.redirect(page.route);
        })
    })
    .catch(next);
});

router.get('/:url', (req, res, next) => {
  return Page.findOne({
      where: {
        urlTitle: req.params.url
      },
      include: [{ model: User, as: 'author' }]
    })
    .then(page => {
      if (!page) generateErr('Page not found.', 404);
      res.render('wikipage', { page });
    })
    .catch(next);
});

function generateErr(msg, status) {
  const error = new Error(msg);
  error.status = status;
  throw error;
}

module.exports = router;
