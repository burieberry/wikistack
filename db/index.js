const Sequelize = require('sequelize');
const conn = require('./conn');
const Page = require('./Page'),
      User = require('./User');

Page.belongsTo(User, { as: 'author' });

const sync = () => {
  return conn.sync({ force: true });
}

const seed = () => {
  return require('./seed')(User, Page);
}

module.exports = {
  sync,
  seed,
  models: {
    Page,
    User
  }
}
