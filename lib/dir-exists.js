'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));



module.exports = function(path){
  return fs.statAsync(path)
  .then(() => console.log('This folder already exists'))
  .then(() => true)
  .catch((err) => {
    if(err.message.startsWith('ENOENT')) return false;
  });
};


//HELP: How do I properly check for if a folder already exists and pass it over so I don't pull down PRs
