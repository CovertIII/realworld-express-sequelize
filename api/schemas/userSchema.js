const R = require('ramda');

const userSchema = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email'
        },
        password: {
          type: 'string',
          minLength: 8,
          maxLength: 1000
        },
        bio: {
          type: 'string',
          maxLength: 5000
        },
        image: {
          type: 'string',
          maxLength: 2000,
          format: 'uri'
        },
        username: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
        },
      },
      required: []
    }
  },
  required: ['user']
};

const createUserSchema = R.evolve({
  properties: { user: { required: R.concat(['password', 'email', 'username'])}}
}, userSchema);

module.exports = {
  userSchema,
  createUserSchema
};
