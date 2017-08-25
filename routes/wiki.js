const router = require('express').Router();
const Page = require('../db').models.Page;

router.get('/', (req, res, next) => {
  return Page.findAll()
    .then(pages => {
      res.send(pages);
    })
    .catch(next);
});

module.exports = router;
