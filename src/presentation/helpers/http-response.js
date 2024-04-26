const MissingParamError = require('../errors/missing-param-error')
const UnauthorizedError = require('../errors/unauthorized-error')
const ServerError = require('../errors/server-error')

module.exports = class HttpResponse {
  static badRequest (params) {
   return {
       statusCode: 400,
       body: new MissingParamError(params)
   }
  }
  static serverError () {
   return {
       statusCode: 500,
       body: new ServerError()
   }
  }
  static unauthorizedError () {
    return {
        statusCode: 401,
        body: new UnauthorizedError()
    }
  }
  static ok (data) {
    return {
        statusCode: 200,
        body: data
    }
   }
}