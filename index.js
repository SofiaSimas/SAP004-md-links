#!/usr/bin/env node
const mdlinks = require('./md-links')

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
  console.log(`Total: ${stats.total}`)
  console.log(`Unique: ${stats.unique}`)
  if (stats.broken){
    console.log(`Broken: ${stats.broken}`)
  }
}

function init() {
  const options = createOptions(process.argv)
  const fileName = process.argv[2]
  mdlinks(fileName, options).then(links => {
    if(options.stats){
      const stats = createStats(links, options.validate);
      return renderStats(stats)
    }
    console.log(links)
  });
}



init();
