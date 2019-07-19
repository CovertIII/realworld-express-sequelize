console.log('node env in config', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: 'test.env' });
} else if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  }
};
