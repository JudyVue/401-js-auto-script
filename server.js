'use strict';

require('dotenv').config();

const superagent = require('superagent');


//The ideal URL
//https://canvas.instructure.com/api/v1/courses/1107581/assignments?bucket=ungraded&?per_page=999

//This maps to:
//https://canvas.instructure.com/api/v1/courses/1107581/assignments/5939248/submissions?per_page=1000
//Use this URL to get ungraded assignments

let startURL = `https://canvas.instructure.com/api/v1/courses/${process.env.COURSE_ID}`

let studentsURL = `${startURL}/students`

let ungradedLabsURL = `${startURL}/assignments?bucket=ungraded&?per_page=1000`


let ghURL = 'https://github.com/codefellows-seattle-javascript-401d14/lab-31-frontend-auth/pull/4';

// {
//   repoURL:
//   assnCanvasID:
//   labName:
//   studentID:
// }

// return {
//   firstName:
//   lastName:
//   dirName:
//   canvasID:
//   githubUserName:
//   ungradedLabs: []
//   ungradedReadings
// }

let students = [];

const student = (data) => {
  let firstName = data.name.split(' ')[0].trim();
  let lastName = data.name.split(' ')[1].trim();
  let studentModel = {
    firstName,
    lastName,
    dirName: `${firstName}-${lastName[0]}`.toLowerCase(),
    canvasID: data.id,
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
  console.log(res.body);
})
.catch(err => console.error(err.message));
