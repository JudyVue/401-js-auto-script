'use strict';


//app modules
const githubCmd = require('./lib/github-command');
const canvasCmd = require('./lib/canvas-api');


const arg1 = process.argv[2];
const arg2 = process.argv[3];
const arg3 = process.argv[4];
const arg4 = process.argv[5];
const arg5 = process.argv[6];

const main = (arg1, arg2, arg3, arg4, arg5) => {
  Promise.all([
    canvasCmd.fetchCanvasStudents(arg1, arg2, arg3, arg4, arg5),
    // githubCmd.fetchLabRepoURLs(arg1, arg2),
    // canvasCmd.fetchTASection(arg1, arg2),
  ]);
};
main(arg1, arg2, arg3, arg4, arg5);
