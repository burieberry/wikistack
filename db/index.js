const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL, { logging: false });

const Page = conn.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT
  },
  status: {
    type: Sequelize.STRING
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

Page.belongsTo(User);

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
