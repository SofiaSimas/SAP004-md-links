const fs = require('fs');
const marked = require('marked');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const http = require('http')
const https = require('https')

function readFile(path){
  try {
    const data = fs.readFileSync(path, 'ascii');
    return data;
  }
  catch (err) {
    console.error('Ocorreu um erro ao ler o arquivo');
    console.log(err);
  }
  
}

function parseMdToHtml(markdown) {
  return marked(markdown);
}

function getLinks (html, file) {
  const dom = new JSDOM(html);
  const links = dom.window.document.querySelectorAll('a');
  const parsedLinks = parseLinks(links, file)
  return parsedLinks;
}

function parseLinks(links, file) {
  return Array.from(links).map((link) => {
    return {
      href:link.href,
      text:link.textContent,
      file,
    }
  })
}



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

function validateLinks(links){
  const linkPromises = links.map(validateLink)

  return Promise.all(linkPromises)
}

function mdlinks(path, options) {
  return new Promise (function(resolve, reject) {
    const fileContent = readFile(path)
    const htmlContent = parseMdToHtml(fileContent)
    const links = getLinks(htmlContent, path)

    if (options.validate){
      validateLinks(links).then(result => resolve(result))
    } else {
      resolve(links);
    }
  })
}

module.exports = mdlinks;