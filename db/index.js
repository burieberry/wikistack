const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL, { logging: false });

const Page = conn.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: 'open'
  },
  route: {
    type: Sequelize.VIRTUAL,
    get() {
      return '/wiki/' + this.getDataValue('urlTitle');
    }
  }
}, {
  hooks: {
    beforeValidate: function(page) {
      if (page.title) {
        page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '').toLowerCase();
      }
    }
  }
}, {
  timestamps: false
});

const User = conn.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});

User.createUser = function(userData) {
  return this.create(userData);
};

User.findUser = function(userData) {
  return this.findOne({
    where: {
      name: userData.name,
      email: userData.email
    }
  })
};

Page.createPage = function(pageData, user) {
  return this.create(pageData)
    .then(page => {
      if (user) page.setAuthor(user);
      return page;
    })
};

Page.belongsTo(User, { as: 'author' });

const sync = () => {
  return conn.sync({ force: true });
}

const seed = () => {
  return require('./seed')(User, Page);
}

module.exports = {
  conn,
  sync,
  seed,
  models: {
    Page,
    User
  }
}
