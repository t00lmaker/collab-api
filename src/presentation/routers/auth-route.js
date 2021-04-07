const HttpResponse = require('../helpers/http-response')

module.exports = class AuthRouter {
  constructor ({ authUseCase } = {}) {
    this.authUseCase = authUseCase
  }

  async route (request) {
    try {
      const { email, secret } = request.body

      if (!email || !secret) {
        return HttpResponse.badRequest()
      }

      const acessToken = await this.authUseCase.auth(email, secret)

      if (acessToken) {
        return HttpResponse.ok({ token: acessToken })
      } else {
        return HttpResponse.unauthorizedError()
      }
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
