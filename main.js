'use strict';

require('dotenv').config();
const debug = require('debug')('grading-main');

//app modules
const githubCmd = require('./lib/github-command');
const canvasCmd = require('./lib/canvas-api');

const main = () => {
  return Promise.resolve(githubCmd.fetchLabRepoURLs())
    .then(labName => canvasCmd.canvasAPIPromiseChain(labName))
    .catch(err => console.log(err.message));

};
main();
