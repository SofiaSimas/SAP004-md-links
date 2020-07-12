const fs = require('fs');
const marked = require('marked');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const validateLink = require('./validate-link')

function readFile(path){
  try {
    const data = fs.readFileSync(path, 'ascii');
    return data;
  }
  catch (err) {
    throw new Error('Ocorreu um erro ao ler o arquivo');
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

function validateLinks(links){
  const linkPromises = links.map(validateLink)

  return Promise.all(linkPromises)
}

function mdlinks(path, options) {
  return new Promise (function(resolve, reject) {
    try {
      const fileContent = readFile(path)
      const htmlContent = parseMdToHtml(fileContent)
      const links = getLinks(htmlContent, path)

      if (options && options.validate){
        validateLinks(links).then(result => resolve(result))
      } else {
        resolve(links);
      }
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = mdlinks;
