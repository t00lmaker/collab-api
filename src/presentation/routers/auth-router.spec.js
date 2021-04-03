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
})
