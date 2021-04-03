class AuthRouter {
  route (request) {
    const { email, secret } = request.body
    if (!email || !secret) {
      return {
        statusCode: 400
      }
    }
  }
}

describe('AuthRouter', () => {
  it('should return 400 if no email is provider', () => {
    const sut = new AuthRouter()
    const request = {
      body: {
        secret: 'pass'
      }
    }

    const response = sut.route(request)

    expect(response.statusCode === 400)
  })

  it('should return 400 if no secret is provider', () => {
    const sut = new AuthRouter()
    const request = {
      body: {
        email: 'mail@mail.com'
      }
    }

    const response = sut.route(request)

    expect(response.statusCode === 400)
  })

  it('should return 400 if secret is empty', () => {
    const sut = new AuthRouter()
    const request = {
      body: {
        secret: '',
        email: 'mail@mail.com'
      }
    }

    const response = sut.route(request)

    expect(response.statusCode === 400)
  })
})
