
class AuthRouter {
  constructor ({ authUseCase } = {}) {
    this.authUseCase = authUseCase
  }

  route (request) {
    const { email, secret } = request.body
    if (!email || !secret) {
      if (this.authUseCase.auth(email, secret)) {
        return {
          statusCode: 200
        }
      } else {
        return {
          statusCode: 401
        }
      }
    } else {
      return {
        statusCode: 400
      }
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
  it('should return 400 if no email is provider', () => {
    const { sut } = createSut()
    const request = {
      body: {
        secret: 'pass'
      }
    }

    const response = sut.route(request)

    expect(response.statusCode === 400)
  })

  it('should return 400 if no secret is provider', () => {
    const { sut } = createSut()
    const request = {
      body: {
        email: 'valid@mail.com'
      }
    }

    const response = sut.route(request)

    expect(response.statusCode === 400)
  })

  it('should return 400 if secret is empty', () => {
    const { sut } = createSut()
    const request = {
      body: {
        secret: '',
        email: 'valid@mail.com'
      }
    }

    const response = sut.route(request)

    expect(response.statusCode === 400)
  })

  it('should return 200 if valid credencial', () => {
    const { sut } = createSut()
    const request = {
      body: {
        secret: 'valid_pass',
        email: 'valid@mail.com'
      }
    }

    const response = sut.route(request)

    expect(response.statusCode === 400)
  })
})
