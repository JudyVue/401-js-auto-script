'use strict';

require('dotenv').config();

const Promise = require('bluebird');
const childProcess = Promise.promisifyAll(require('child_process'));


//The ideal URL
//https://canvas.instructure.com/api/v1/courses/1107581/assignments?bucket=ungraded&?per_page=999

//This maps to:
//https://canvas.instructure.com/api/v1/courses/1107581/assignments/5939248/submissions?per_page=1000
//Use this URL to get ungraded assignments


let perPage = '?per_page=1000';
let canvasURL = `https://canvas.instructure.com/api/v1/courses/${process.env.COURSE_ID}`;

let studentsURL = `${canvasURL}/students`

let ungradedLabsURL = `${canvasURL}/assignments?bucket=ungraded&${perPage}`

let className = 'codefellows-seattle-javascript-401d14';
let ghURL = 'https://api.github.com';

let command = process.argv[2];

let gitFetch = 'git fetch origin pull';

const main = (url) => {
  return fetchMainLabRepo(url)
  .then(() => {
    return fetchPullRequests(url);
  });
};

//clones down the class's main lab repo
const fetchMainLabRepo = (url) => {
  return childProcess.execAsync(`git clone ${url}`)
  .then(() => {
    console.log('success cloning main lab repo!');
  }).catch(err => {
    console.error(err);
  });
};

const fetchPullRequests = (url) => {
  let num = 0;
  while(!isNaN(num)){
    let labName = url.split('/').pop().split('.git').join('').trim();
    return childProcess.execAsync(`cd ${labName}; ${gitFetch}/${++num}/head:${num}`)
    .then(() => {
      console.log(`success fetching pull# ${num}`);
    })
    .catch(err => {
      console.error(err);
    });
  }
};

main(command);
