module.exports = (User, Page) => {
  return Promise.all([
    User.create({ name: 'Foo', email: 'foo@gmail.com' }),
    User.create({ name: 'Bar', email: 'bar@gmail.com' }),
    User.create({ name: 'Bazz', email: 'bazz@gmail.com' })
  ])
  .then(([ foo, bar, bazz ]) => {
    return Promise.all([
      Page.create({ title: 'Foo Page', content: 'Foo foo foo.', authorId: foo.id }),
      Page.create({ title: 'Bar Page', content: 'Bar bar bar.', authorId: bar.id }),
      Page.create({ title: 'Bazz Page', content: 'Bazz bazz bazz.', authorId: bazz.id })
    ])
  })
  .then(([ foo, bar, bazz ]) => {
    return foo, bar, bazz;
  })
  .catch(console.error);
}
