const commentSchema = {
  type: 'object',
  properties: {
    comment: {
      type: 'object',
      properties: {
        body: {
          type: 'string',
          minLength: 1,
          maxLength: 5000,
          description: 'comment body'
        }
      },
      required: ['body']
    }
  },
  required: ['comment']
};

module.exports = {
  commentSchema
};
