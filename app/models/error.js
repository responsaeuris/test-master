module.exports = {
  type: 'object',
  properties: {
    statusCode: {
      type: 'integer',
      format: 'int32',
      nullable: false,
    },
    error: {
      type: 'string',
      nullable: false,
    },
    message: {
      type: 'string',
      nullable: false,
    },
    stackTrace: {
      type: 'string',
      nullable: true,
    },
  },
  additionalProperties: true,
}
