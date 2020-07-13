const validateLink = require('../validate-link')

describe('validateLink', () => {
  test('should validate https link is ok', (done) => {
    const link = {
      href:'https://www.google.com',
      text: 'Google',
      file:'teste.md'
    }
    validateLink(link).then((result) => {
      expect(result).toStrictEqual({
        href:'https://www.google.com',
        text: 'Google',
        file:'teste.md',
        success: 'ok',
        statusCode: 200
      })
      done()
    })
  })

  test('should validate http link is ok', (done) => {
    const link = {
      href:'http://www.google.com',
      text: 'Google',
      file:'teste.md'
    }
    validateLink(link).then((result) => {
      expect(result).toStrictEqual({
        href:'http://www.google.com',
        text: 'Google',
        file:'teste.md',
        success: 'ok',
        statusCode: 200
      })
      done()
    })
  })

  test('should return fail when link is not http/https', (done) => {
    const link = {
      href:'about:test',
      text: 'Test link',
      file:'teste.md'
    }
    validateLink(link).then((result) => {
      expect(result).toStrictEqual({
        href:'about:test',
        text: 'Test link',
        file:'teste.md',
        success: 'fail',
        statusCode: 400
      })
      done()
    })
  })
})