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
  return User.findUser(req.body)
    .then(user => {
      if (!user) {
        return User.createUser(req.body)
          .then(user => {
            return Page.createPage(req.body, user)
          })
          .then(page => {
            console.log(page.get());
            res.redirect(page.route);
          })
      }

      else return Page.createPage(req.body, user)
        .then(page => {
          console.log(page.get());
          res.redirect(page.route);
        })
    })

  // return User.findOne({
  //     where: {
  //       name: req.body.name,
  //       email: req.body.email
  //     }
  //   })
  //   .then(user => {
  //     return Page.create(req.body)
  //       .then(page => {
  //         return page.setAuthor(user);
  //       })
  //   })
  //   .then(page => {
  //     res.redirect(page.route);
  //   })
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
      if (!page) return res.sendStatus(404);
      res.render('wikipage', { page });
    })
    .catch(next);
});

module.exports = router;
