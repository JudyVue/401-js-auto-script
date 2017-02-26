'use strict';

require('dotenv').config();

const Promise = require('bluebird');
const childProcess = Promise.promisifyAll(require('child_process'));
const superagent = require('superagent');
const debug = require('debug')('grading');


//The ideal URL
//https://canvas.instructure.com/api/v1/courses/1107581/assignments?bucket=ungraded&?per_page=999

//This maps to:
//https://canvas.instructure.com/api/v1/courses/1107581/assignments/5939248/submissions?per_page=1000
//Use this URL to get ungraded assignments


let perPage = '?per_page=1000';
let canvasURL = `https://canvas.instructure.com/api/v1/courses/${process.env.CANVAS_COURSE_ID}`;

let studentsURL = `${canvasURL}/students`

let ungradedLabsURL = `${canvasURL}/assignments?bucket=ungraded&${perPage}`

let ghURL = `https://api.github.com/orgs/${process.env.CF_COURSE_ID}`;

let arg1 = process.argv[2];
let arg2 = process.argv[3];

let canvasAuthHeader = {Authorization: `Bearer ${process.env.CANVAS_TOKEN}`};


let githubAuthHeader = {Authorization: `Bearer ${process.env.GITHUB_TOKEN}`};

const fetchLabRepoURLs = () => {
  superagent.get(`${ghURL}/repos`)
  .set(githubAuthHeader)
  .then(res =>res.body.map(repo => repo.clone_url))
  .then(cloneURLs => cloneURLs)
  .catch(err => console.error(err.message));
};




const main = (url) => {
  Promise.all([
    fetchMainLabRepo(url),
    fetchCanvasStudents(),
    fetchPullRequests(url, 1),
  ]);
};


const fetchCanvasStudents = () => {
  debug('fetchCanvasStudents');
  superagent.get(studentsURL)
  .set(canvasAuthHeader)
  .then(res => res.body.map(student => {
    let modStudent =  {
      first: student.name.split(' ')[0].trim().toLowerCase(),
      last: student.name.split(' ')[1].trim().toLowerCase(),
      canvasID: student.id,
    };
    return modStudent;
  }))
  .then(students => console.log(students))
  .catch(err => console.log(err.message));
};

//clones down the class's main lab repo
const fetchMainLabRepo = (url) => {
  debug('fetchMainLabRepo')
  return childProcess.execAsync(`git clone ${url}`)
  .then(() => {
    debug('success cloning main lab repo!');
  }).catch(() => {
    debug('folder already exists');
  });
};

const fetchPullRequests = (url, num) => {
  debug('fetchPullRequests');
  let gitFetch = 'git fetch origin pull';
  while(num){
    let labName = url.split('/').pop().split('.git').join('').trim();
    return childProcess.execAsync(`cd ${labName}; ${gitFetch}/${num}/head:${num}`)
    .then(() => {
      debug(`success fetching pull# ${num}`);
      num++;
      return fetchPullRequests(url, num);
    })
    .catch(() => {
      if (num === 1) debug('This repo has no PRs.');
      if (num > 1) debug('All PRs pulled down.');
    });
  }
};

let canvasPostURL = 'https://canvas.instructure.com/api/v1/courses/1107581/assignments/5628634/submissions/5545113'


const postGrade = (score, comment = null) => {
  let gradeKey = 'submission[posted_grade]';
  let commentKey = 'comment[text_comment]';
  superagent.put(`${canvasPostURL}/?${gradeKey}=${score}&${commentKey}=${comment}`)
  .set(canvasAuthHeader)
  .end(err => {
    if(err) return debug(err.message, 'error');
    debug('post successful');
  });
};
 // /^(\-|\+)?([0-9]+|Infinity)$/.test(number)
 //^ set at beginning matches very beginning of input
  //For example, /^A/ does not match the "A" in "an A", but does match the first "A" in "An A".
// (\-|\+) means the beginning can start with either '-' or '+'
// ? means the preceding (\-|\+) is optional
// \d+ means look for all digits 0-9, the '+' right after means including multiple digit nums, i.e. '10' would fail without the '+' because it is > 1 char

// |Infinity)$ means 'or Infinity' and $ ends the string lookup
if (/^(\-|\+)?(\d+|Infinity)$/.test(arg1)) console.log(arg1, 'is a number');

// main(arg1);
