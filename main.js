'use strict';

require('dotenv').config();
const debug = require('debug')('grading-main');

//app modules
const githubCmd = require('./lib/github-command');
const canvasCmd = require('./lib/canvas-api');

const main = () => {


  Promise.all([
    canvasCmd.fetchCanvasStudents(),
    githubCmd.fetchLabRepoURLs(),
  ]);

};
main();
