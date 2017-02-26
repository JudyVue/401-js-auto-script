'use strict';

require('dotenv').config();

const Promise = require('bluebird');
const childProcess = Promise.promisifyAll(require('child_process'));
const superagent = require('superagent');
const debug = require('debug');


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

let arg1 = process.argv[2];
let arg2 = process.argv[3];

let gitFetch = 'git fetch origin pull';

const main = (url) => {
  return fetchMainLabRepo(url)
  .then(() => {
    return fetchPullRequests(url, 1);
  });
};

//clones down the class's main lab repo
const fetchMainLabRepo = (url) => {
  return childProcess.execAsync(`git clone ${url}`)
  .then(() => {
    console.log('success cloning main lab repo!');
  }).catch(() => {
    console.error('folder already exists');
  });
};

const fetchPullRequests = (url, num) => {
  while(num){
    let labName = url.split('/').pop().split('.git').join('').trim();
    return childProcess.execAsync(`cd ${labName}; ${gitFetch}/${num}/head:${num}`)
    .then(() => {
      console.log(`success fetching pull# ${num}`);
      num++;
      return fetchPullRequests(url, num);
    })
    .catch(() => {
      if (num === 1) console.log('This repo has no PRs.');
      if (num > 1) console.log('All PRs pulled down.');
    });
  }
};

let canvasPostURL = 'https://canvas.instructure.com/api/v1/courses/1107581/assignments/5628634/submissions/5545113'


const postGrade = (score, comment = null) => {
  let gradeKey = 'submission[posted_grade]';
  let commentKey = 'comment[text_comment]';
  superagent.put(`${canvasPostURL}/?${gradeKey}=${score}&${commentKey}=${comment}`)
  .set('Authorization', `Bearer ${process.env.CANVAS_TOKEN}`)
  .end(err => {
    if(err) return console.error(err.message, 'error');
    console.log('post successful');
  });
};

postGrade(arg1, arg2);
// main(command);
