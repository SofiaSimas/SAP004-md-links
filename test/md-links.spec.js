const mdLinks = require('../md-links');
const expectedOutput = require('./mocks/expectedOutput')
const expectedValidateOutput = require('./mocks/expectedValidateOutput')
const validateLink = require('../validate-link');

jest.mock('../validate-link')


describe('mdLinks', () => {

  test('should read links from file', (done) => {
    mdLinks('test/test-file.md')
      .then((result)=> {
        expect(result).toStrictEqual(expectedOutput)
        done()
      })
  });

  test('should read links from file and validate them', (done) => {
    validateLink.mockImplementation((link) => {
      return new Promise((resolve) => {
        resolve({
          ...link,
          statusCode: 200,
          success: 'ok'
        })
      })
    })
    const options = {
      validate:true,
    }
    mdLinks('test/test-file.md', options)
      .then((result) => {
    
        expect(result).toStrictEqual(expectedValidateOutput)
        done()
      })
  })

  test('should throw error when file is not found', (done) => {
    mdLinks('batatinha.md').catch((error) => {
      expect(error.message).toBe('Ocorreu um erro ao ler o arquivo')
      done()
    })
  })

});
