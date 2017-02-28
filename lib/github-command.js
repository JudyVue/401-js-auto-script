'use strict';

module.exports = exports = {};
require('dotenv').config();


//npm modules
const superagent = require('superagent');
const Promise = require('bluebird');
const debug = require('debug')('grading-github');

//node modules
const childProcess = Promise.promisifyAll(require('child_process'));
const fs = Promise.promisifyAll(require('fs'));


const githubAuthHeader = {Authorization: `Bearer ${process.env.GITHUB_TOKEN}`};

const ghURL = `https://api.github.com/orgs/${process.env.CF_COURSE_ID}`;

const arg1 = process.argv[2];
const arg2 = process.argv[3];
const ghStorage = {};
const isNumber = /^(\-|\+)?(\d+|Infinity)$/;

exports.fetchLabRepoURLs = () => {
  debug('fetchLabRepoURLs');
  superagent.get(`${ghURL}/repos`)
  .set(githubAuthHeader)
  .then(res => res.body.reverse())
  .then(repos => repos.forEach((repo, index) => {
    index++;
    ghStorage[index] = repo.clone_url;
  }))
  .then(() => exports.cloneMainLabRepo(ghStorage[1]))
  .then(() => {
    if (arg1 && isNumber.test(arg1)){
      return exports.cloneAPastRepo(arg1);
    }
  })
  .then(() => exports.lookUpPreviousLabs())
  .catch(err => console.error(err.message));
};

//clones down the class's main lab repo, which is autmoatically the most recent one
exports.cloneMainLabRepo = (url) => {
  debug('cloneMainLabRepo');
  let labName = url.split('/').pop().split('.git').join('').trim();
  return fs.statAsync(labName)
  .then(() => {
    console.log('This folder already exists, moving on to next block');
  })
  .catch(() => {
    return childProcess.execAsync(`git clone ${url}`)
    .then(() => {
      debug('success cloning main lab repo!');
    }).catch(() => {
      debug('folder already exists, no need to Git clone');
    })
    .then(() => exports.makeStudentGitBranches(url, 1));
  });
};

exports.cloneAPastRepo = (num) => {
  let labName = ghStorage[num].split('/').pop().split('.git').join('').trim();
  return fs.statAsync(labName)
    .then(() => {
      console.log('This folder already exists, cloneAPastRepo');
    })
    .catch(() => {
      return exports.cloneMainLabRepo(ghStorage[num]);
    });
};


exports.makeStudentGitBranches = (url, num) => {
  debug('makeStudentGitBranches');
  let gitFetch = 'git fetch origin pull';
  let labName = url.split('/').pop().split('.git').join('').trim();

  exports.labName = labName;
  return childProcess.execAsync(`cd ${labName}; ${gitFetch}/${num}/head:${num}`)
    .then(() => {
      debug(`success fetching pull# ${num}`);
      num++;
      return exports.makeStudentGitBranches(url, num);
    })
    .catch(() => {
      if (num === 1) debug('This repo has no PRs.');
      if (num > 1) debug('All PRs pulled down.');
      return;
    });
};

exports.lookUpPreviousLabs = () => {
  if(arg1 === 'list' && arg2 === 'labs'){
    return new Promise((resolve) => {
      resolve(debug('\nType in the command "npm run start <number>" to clone the corresponding lab.\n', '\n',ghStorage));
    });
  }
};
