'use strict';

require('dotenv').config();

const superagent = require('superagent');


//The ideal URL
//https://canvas.instructure.com/api/v1/courses/1107581/assignments?bucket=ungraded&?per_page=999

//This maps to:
//https://canvas.instructure.com/api/v1/courses/1107581/assignments/5939248/submissions?per_page=1000
//Use this URL to get ungraded assignments

let discussion = 'discussion_topic'
let perPage = '?per_page=1000';
let canvasURL = `https://canvas.instructure.com/api/v1/courses/${process.env.COURSE_ID}`;

let studentsURL = `${canvasURL}/students`

let ungradedLabsURL = `${canvasURL}/assignments?bucket=ungraded&${perPage}`

let ghURL = 'https://github.com';


let students = [];
let ungradedLabIDs = [];

const student = (data) => {
  let firstName = data.name.split(' ')[0].trim();
  let lastName = data.name.split(' ')[1].trim();
  let ungradedLabs = [];
  let studentModel = {
    firstName,
    lastName,
    dirName: `${firstName}-${lastName[0]}`.toLowerCase(),
    canvasID: data.id,
    ungradedLabs,
  };
  return studentModel;
};
//
superagent.get(studentsURL)
.set('Authorization', `Bearer ${process.env.CANVAS_TOKEN}`)
.then(res => {
  return res.body;
})
.then((res) => {
  return students = res.map(element => student(element));
})
.catch(err => console.error(err.message));


superagent.get(ungradedLabsURL)
.set('Authorization', `Bearer ${process.env.CANVAS_TOKEN}`)
.then(res => {
  return ungradedLabIDs = res.body.map(lab => lab.id);
})
.then((ids) => {
  for (let id of ids){
    return superagent.get(`${canvasURL}/assignments/${id}/submissions${perPage}`)
    .set('Authorization', `Bearer ${process.env.CANVAS_TOKEN}`)
  }
})
.then(res => {
  return res.body.filter(lab => lab.graded_at === null).filter(lab => lab.submission_type !== discussion)
})
.then(labs => {
  let obj = {};
  for (let student of students){
    for (let lab of labs){
      if (student.canvasID === lab.user_id){
        ungraded.canvasLabID = lab.assignment_id;
        ungraded.labName =
      }
    }
  }
})
.catch(err => console.error(err.message));
