const HttpResponse = require('../helpers/http-response')
class AuthRouter {
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

const createSut = () => {
  const authUseCaseSpy = createAuthUseCase()
  const sut = new AuthRouter({
    authUseCase: authUseCaseSpy
  })
  return {
    sut,
    authUseCaseSpy
  }
}

const createAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth (email, secret) {
      this.email = email
      this.secret = secret
      return this.acessToken
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.acessToken = 'valid_token'
  return authUseCaseSpy
}

describe('AuthRouter', () => {
  it('should return 500 if authUseCase not provided', async () => {
    const sut = new AuthRouter()
    const request = {
      body: {
        secret: 'valid_pass',
        email: 'valid@mail.com'
      }
    }

    const response = await sut.route(request)

    expect(response.statusCode).toBe(500)
  })

  it('should return 500 if no body in request', async () => {
    const { sut } = createSut()
    const request = { }

    const response = await sut.route(request)

    expect(response.statusCode).toBe(500)
  })

  it('should return 400 if no email is provider', async () => {
    const { sut } = createSut()
    const request = {
      body: {
        secret: 'pass'
      }
    }

    const response = await sut.route(request)

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 if no secret is provider', async () => {
    const { sut } = createSut()
    const request = {
      body: {
        email: 'valid@mail.com'
      }
    }

    const response = await sut.route(request)

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 if secret is empty', async () => {
    const { sut } = createSut()
    const request = {
      body: {
        secret: '',
        email: 'valid@mail.com'
      }
    }

    const response = await sut.route(request)

    expect(response.statusCode).toBe(400)
  })

  it('should return 401 if incorrect credencials', async () => {
    const { sut, authUseCaseSpy } = createSut()
    authUseCaseSpy.acessToken = null
    const request = {
      body: {
        secret: 'valid_pass',
        email: 'valid@mail.com'
      }
    }

    const response = await sut.route(request)

    expect(response.statusCode).toBe(401)
  })

  it('should return 200 if valid credencial', async () => {
    const { sut } = createSut()
    const request = {
      body: {
        secret: 'valid_pass',
        email: 'valid@mail.com'
      }
    }

    const response = await sut.route(request)

    expect(response.statusCode).toBe(200)
  })
})
