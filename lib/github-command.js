'use strict';

module.exports = exports = {};
require('dotenv').config();

//app modules
const {reverse} = require('../helpers/optimization');

//npm modules
const superagent = require('superagent');
const Promise = require('bluebird');

const debug = require('debug')('grading-github');

//node modules
const childProcess = Promise.promisifyAll(require('child_process'));
const fs = Promise.promisifyAll(require('fs'));

const githubAuthHeader = {Authorization: `Bearer ${process.env.GITHUB_TOKEN}`};

const ghURL = `https://api.github.com/orgs/${process.env.CF_COURSE_ID}`;
const ghBaseURL = 'https://api.github.com';

const ghStorage = {};
const isNumber = /^(\-|\+)?(\d+|Infinity)$/;

exports.fetchLabRepoURLs = (arg1, arg2) => {
  debug('fetchLabRepoURLs');
  superagent.get(`${ghURL}/repos`)
  .set(githubAuthHeader)
  .then(res => reverse(res.body))
  .then(repos => repos.forEach((repo, index) => {
    index++;
    ghStorage[index] = repo.clone_url;
  }))
  .then(() => exports.cloneMainLabRepo(ghStorage[1], exports.makeStudentGitBranches))
  .then(() => exports.cloneAPastRepo(arg1))
  .then(() => exports.lookUpPreviousLabs(arg1, arg2))
  .catch(err => console.error(err.message));
};

//clones down the class's main lab repo, which is autmoatically the most recent one
exports.cloneMainLabRepo = (url, makeStudentGitBranches) => {
  debug('cloneMainLabRepo');
  let labName = url.split('/').pop().split('.git').join('').trim();
  return fs.statAsync(labName)
  .then(() => {
    debug(`${labName} already exists, moving onto next block`);
  })
  .catch(() => {
    return childProcess.execAsync(`git clone ${url}`)
    .then(() => {
      debug('success cloning main lab repo!');
    })
    .then(() => makeStudentGitBranches(url, _getPullNumbers));
  })
    .catch(err => console.error(err.message));
};

exports.cloneAPastRepo = (arg1) => {
  if (arg1 && isNumber.test(arg1)){
    let labName = ghStorage[arg1].split('/').pop().split('.git').join('').trim();
    return fs.statAsync(labName)
    .then(() => {
      debug(`${labName} already exists`);
    })
    .catch(() => {
      return exports.cloneMainLabRepo(ghStorage[arg1], exports.makeStudentGitBranches);
    });
  }
};

const _getPullNumbers = (labName) => {
  let url = `${ghBaseURL}/repos/${process.env.CF_COURSE_ID}/${labName}/pulls`;
  return superagent.get(url)
  .set(githubAuthHeader)
  .then(res => res.body)
  .catch(err => console.error(err.mesage));
};

exports.makeStudentGitBranches = (url, getPullNumbers) => {
  debug('makeStudentGitBranches');
  let gitFetch = 'git fetch origin pull';
  let labName = url.split('/').pop().split('.git').join('').trim();

  getPullNumbers(labName)
  .then(pullNumbers => {
    pullNumbers.forEach(pull => {
      debug(`success pulling down pull#${pull.number} from user ${pull.user.login}`);
      return childProcess.execAsync(`cd ${labName}; ${gitFetch}/${pull.number}/head:${pull.number}-${pull.user.login}`);
    });
  })
  .then(() => debug('All PRs pulled down.'))
  .catch(() => debug('This repo has no PRs.'));
};


exports.lookUpPreviousLabs = (arg1, arg2) => {
  if(arg1 === 'list' && arg2 === 'labs'){
    debug('\nType in the command "npm run start <number>" to clone the corresponding lab.\n', '\n',ghStorage);
  }
};
