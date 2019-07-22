const articleSchema = {
  type: 'object',
  properties: {
    article: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          minLength: 1,
          maxLength: 255
        },
        description: {
          type: 'string',
          description: 'Short summary of the article',
          minLength: 1,
          maxLength: 2000
        },
        body: {
          type: 'string',
          minLength: 1,
          description: 'Can use markdown.'
        },
        tagList: {
          type: 'array',
          items: {
            type: 'string',
            minLength: 1,
            maxLength: 255
          }
        }
      },
      required: ['title', 'body', 'description', 'tagList']
    }
  },
  required: ['article']
};

module.exports = {
  articleSchema
};
