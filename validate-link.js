const http = require('http');
const https = require('https');

function validateLink(link){
  return new Promise((resolve, reject) => {
    if (link.href.toLowerCase().startsWith('http')){
      let protocol = http;
      if (link.href.toLowerCase().startsWith('https')){
        protocol = https;
      }
      protocol.get(link.href, (res) => {
        const { statusCode } = res;
        let success
        if (statusCode >= 200 || statusCode <=399) {
          success = 'ok';
        } else {
          success = 'fail';
        }
        resolve({
          ...link, 
          statusCode,
          success,
        })
      })
    } else {
      resolve({
        ...link, 
        statusCode: 400,
        success:'fail',
      })
    }
  })
}

module.exports = validateLink