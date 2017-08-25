module.exports = (User, Page) => {
  return Promise.all([
    User.create({ name: 'foo', email: 'foo@gmail.com' }),
    User.create({ name: 'bar', email: 'bar@gmail.com' }),
    User.create({ name: 'bazz', email: 'bazz@gmail.com' })
  ])
  .then(([ foo, bar, bazz ]) => {
    return Promise.all([
      Page.create({ title: 'Foo Page', content: 'Foo foo foo.', userId: foo.id }),
      Page.create({ title: 'Bar Page', content: 'Bar bar bar.', userId: bar.id }),
      Page.create({ title: 'Bazz Page', content: 'Bazz bazz bazz.', userId: bazz.id })
    ])
  })
  .then(([ foo, bar, bazz ]) => {
    return foo, bar, bazz;
  })
  .catch(console.error);
}
