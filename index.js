#!/usr/bin/env node
const mdlinks = require('./md-links')
const chalk = require('chalk')

function createStats (links, validate){
  const allLinks = links.map((link) => link.href)
  const total = allLinks.length;
  const unique = new Set(allLinks).size;
  if(validate){
    const broken = links.filter((link) => link.success === 'fail').length;
    return {
      total,
      unique,
      broken,
    }
  } 
  return {
    total,
    unique,
  }
}

function createOptions(arg){
  const validate = arg.includes('--validate')
  const stats = arg.includes('--stats')

  return {
    validate,
    stats,
  }
}

function renderStats(stats) {
  console.log(chalk.blueBright(`Total: ${stats.total}`));
  console.log(chalk.greenBright(`Unique: ${stats.unique}`));
  if (stats.broken){
    console.log(chalk.redBright(`Broken: ${stats.broken}`));
  }
}

function conditionalRender(link, property, validation){
  if (validation){
    return link[property]
  }
  return '';
}

function renderLinks(links, validate) {
  const renderLink = (link) => {
    console.log(`${link.file} ${link.href} ${conditionalRender(link, 'success', validate)} ${conditionalRender(link, 'statusCode', validate)} ${link.text}`)
  }

  links.forEach(renderLink)
}

function init() {
  const options = createOptions(process.argv)
  const fileName = process.argv[2]
  mdlinks(fileName, options).then(links => {
    if(options.stats){
      const stats = createStats(links, options.validate);
      return renderStats(stats)
    }
    return renderLinks(links, options.validate)
  });
}



init();
