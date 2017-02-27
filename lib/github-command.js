'use strict';

module.exports = exports = {};
require('dotenv').config();


//npm modules
const superagent = require('superagent');
const Promise = require('bluebird');
const debug = require('debug')('grading');

//node modules
const childProcess = Promise.promisifyAll(require('child_process'));



const githubAuthHeader = {Authorization: `Bearer ${process.env.GITHUB_TOKEN}`};
const ghURL = `https://api.github.com/orgs/${process.env.CF_COURSE_ID}`;

let arg1 = process.argv[2];
let arg2 = process.argv[3];

let ghStorage = {};
// return githubCmd.fetchLabRepoURLs()
//   .then((ghStorage) => cloneMainLabRepo(ghStorage[1]))
//   .then(() => makeStudentGitBranches(ghStorage[1], 1)
//   .then(() => cloneAPastRepo())
//   .then(() => lookUpPreviousLabs())
//   .catch(err => console.error(err.message))

// .then(() => cloneMainLabRepo(ghStorage[1]))
//  .then(() => makeStudentGitBranches(ghStorage[1], 1)
//  .then(() => cloneAPastRepo())
//  .then(() => lookUpPreviousLabs())
//  .catch(err => console.error(err.message)));

exports.fetchLabRepoURLs = () => {
  superagent.get(`${ghURL}/repos`)
  .set(githubAuthHeader)
  .then(res => res.body.reverse())
  .then(repos => repos.forEach((repo, index) => {
    index++;
    ghStorage[index] = repo.clone_url;
  }))
  .then(() => exports.cloneMainLabRepo(ghStorage[1]))
  .then(() => exports.makeStudentGitBranches(ghStorage[1], 1)
  .then(() => exports.cloneAPastRepo())
  .then(() => exports.lookUpPreviousLabs())
  .catch(err => console.error(err.message)));
};

//clones down the class's main lab repo, which is autmoatically the most recent one
exports.cloneMainLabRepo = (url) => {
  debug('cloneMainLabRepo');
  return childProcess.execAsync(`git clone ${url}`)
  .then(() => {
    debug('success cloning main lab repo!');
  }).catch(() => {
    debug('folder already exists');
  });
};

//TODO the repeat is happening here where it is starting all over again from original
exports.cloneAPastRepo = () => {
  // /^(\-|\+)?([0-9]+|Infinity)$/.test(number)
  //^ set at beginning matches very beginning of input
  //For example, /^A/ does not match the "A" in "an A", but does match the first "A" in "An A".
  // (\-|\+) means the beginning can start with either '-' or '+'
  // ? means the preceding (\-|\+) is optional
  // \d+ means look for all digits 0-9, the '+' right after means including multiple digit nums, i.e. '10' would fail without the '+' because it is > 1 char

  // |Infinity)$ means 'or Infinity' and $ ends the string lookup
  if (/^(\-|\+)?(\d+|Infinity)$/.test(arg1)){
    return exports.cloneMainLabRepo(ghStorage[arg1])
    .then(() => makeStudentGitBranches(ghStorage[arg1], 1));
  }
};


exports.makeStudentGitBranches = (url, num) => {
  debug('makeStudentGitBranches');
  let gitFetch = 'git fetch origin pull';
  let labName = url.split('/').pop().split('.git').join('').trim();
  while(num){
    return childProcess.execAsync(`cd ${labName}; ${gitFetch}/${num}/head:${num}`)
    .then(() => {
      debug(`success fetching pull# ${num}`);
      num++;
      return exports.makeStudentGitBranches(url, num);
    })
    .catch(() => {
      if (num === 1) debug('This repo has no PRs.');
      if (num > 1) debug('All PRs pulled down.');
    });
  }
};

exports.lookUpPreviousLabs = () => {
  if(arg1 === 'list' && arg2 === 'labs'){
    return new Promise((resolve) => {
      resolve(debug('\nType in the command "npm run start <number>" to clone the corresponding lab.\n', '\n',ghStorage));
    });
  }
};
