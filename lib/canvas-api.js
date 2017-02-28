'use strict';


module.exports = exports = {};
require('dotenv').config();

const superagent = require('superagent');
const debug = require('debug')('grading-canvas');


let perPage = '?per_page=1000';
let canvasURL = `https://canvas.instructure.com/api/v1/courses/${process.env.CANVAS_COURSE_ID}`;

let canvasPostURL = `${canvasURL}/assignments/5939248/submissions/5920591`;
let studentsURL = `${canvasURL}/students`;
let ungradedLabsURL = `${canvasURL}/assignments?bucket=ungraded&${perPage}`;
let canvasAuthHeader = {Authorization: `Bearer ${process.env.CANVAS_TOKEN}`};
let canvasLabs = {};
let studentSubmissions = [];
let studentStorage = {};

const arg1 = process.argv[2];
const arg2 = process.argv[3];
const arg3 = process.argv[4];
const arg4 = process.argv[5];
const arg5 = process.argv[6];

const isNumber = /^(\-|\+)?(\d+|Infinity)$/;


exports.postGrade = (labNumber, studentName, score, comment) => {
  debug('postGrade');
  let gradeKey = 'submission[posted_grade]';
  let commentKey = 'comment[text_comment]';
  console.log(canvasLabs[labNumber].canvasAssnID, 'postGrade');
  console.log(studentStorage[studentName].canvasID, 'postGrade');
  let url = `${canvasURL}/assignments/${canvasLabs[labNumber].canvasAssnID}/submissions/${studentStorage[studentName].canvasID}/?${gradeKey}=${score}&${commentKey}=${comment}`;
  console.log(url);
  if(!isNumber.test(labNumber))return console.error('Score must be a number');
  if(!isNumber.test(score))return console.error('Score must be a number');

  //let canvasPostURL = `${canvasURL}/assignments/5939248/submissions/5920591`;
  superagent.put(url)
  .set(canvasAuthHeader)
  .end(err => {
    if(err) return console.error(err.message, 'error');
    console.log('post successful');
  });
};

exports.showStudents = () => {
  if (arg1 === 'show' && arg2 === 'students'){
    console.log('Here are your students:\n',studentStorage);
  }
};

exports.showAssignments = () => {
  if(arg1 === 'show' && arg2 === 'ungraded'){
    console.log('Here are ungraded assignments:\n', canvasLabs);
  }
};


exports.fetchCanvasStudents = () => {
  debug('fetchCanvasStudents');
  superagent.get(studentsURL)
  .set(canvasAuthHeader)
  .then(res => {
    return res.body.sort((a, b) =>{
      let lowA = a.name.toLowerCase();
      let lowB= b.name.toLowerCase();
      if (lowA < lowB) return -1;
      if (lowA > lowB) return 1;
      return 0;
    });
  })
  .then(res => {
    res.map(student => {
      let studentName = `${student.name.split(' ')[0].trim().toLowerCase()}-${student.name.split(' ')[1].trim()[0].toLowerCase()}`;
      studentStorage[studentName] = {
        canvasID: student.id,
        first: student.name.split(' ')[0].trim(),
        last: student.name.split(' ')[1].trim(),
      };
    });
    return studentStorage;
  })
  .then((studentStorage) => studentStorage)
  .then(() => exports.showStudents())
  .then(() => exports.fetchUngradedLabs())
  .then(() =>  exports.fetchSubmissionsOfEachLab())
  .then(() => exports.showAssignments())
  .then(() => {
    if(arg1 === 'grade'){
      return exports.postGrade(arg2, arg3, arg4, arg5);
    }
  })
  .catch(() => console.error('Something went wrong'));
};

//npm run get <student> (i.e. jaren-e), gets student's ungraded labs
//npm run grade <student> 1; score; 'comment'

//The ideal URL
//https://canvas.instructure.com/api/v1/courses/1107581/assignments?bucket=ungraded&?per_page=999

//This maps to:
//https://canvas.instructure.com/api/v1/courses/1107581/assignments/5939248/submissions?per_page=1000
//Use this URL to get ungraded assignments

//submission_types: [ 'online_text_entry', 'online_url' ],
exports.fetchUngradedLabs = () => {
  return superagent.get(ungradedLabsURL)
  .set(canvasAuthHeader)
  .then(res => JSON.parse(res.text))
  .then(assns => assns.map((ass, index) => {
    index++;
    canvasLabs[index] = {canvasAssnID: ass.id, name: ass.name};
  }))
  .catch(err => console.error(err.message));
};


//https://canvas.instructure.com/api/v1/courses/1107581/assignments/5939248/submissions?per_page=1000
exports.fetchSubmissionsOfEachLab = () => {
  Object.keys(canvasLabs).forEach((assn) => {
    superagent.get(`${canvasURL}/assignments/${canvasLabs[assn].canvasAssnID}/submissions${perPage}`)
    .set(canvasAuthHeader)
    .then(res => {
      studentSubmissions = studentSubmissions.concat(...JSON.parse(res.text));
      return studentSubmissions;
    })
    .then(() => studentSubmissions)
    .catch(err => console.error(err.message));
  });
};

// https://canvas.instructure.com/api/v1/courses/1107581/students/submissions?student_ids[]=5920591

//1. Get array of students from Canvas and organize info like so:




//THis is the endpoint to PUT to to score a student's assn
//PUT /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id
//'https://canvas.instructure.com/api/v1/courses/1107581/assignments/5628634/submissions/5545113';
// return exports.fetchUngradedLabs()
// .then(() => exports.fetchSubmissionsOfEachLab());
