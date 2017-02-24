'use strict';

require('dotenv').config();

const superagent = require('superagent');


//The ideal URL
//https://canvas.instructure.com/api/v1/courses/1107581/assignments?bucket=ungraded&?per_page=999

//This maps to:
//https://canvas.instructure.com/api/v1/courses/1107581/assignments/5939248/submissions?per_page=1000
//Use this URL to get ungraded assignments


let perPage = '?per_page=1000';
let canvasURL = `https://canvas.instructure.com/api/v1/courses/${process.env.COURSE_ID}`;

let studentsURL = `${canvasURL}/students`

let ungradedLabsURL = `${canvasURL}/assignments?bucket=ungraded&${perPage}`

let ghURL = 'https://api.github.com';

let className = 'codefellows-seattle-javascript-401d14';


//not really using this
const student = (data) => {
  if(data.name){
    var firstName = data.name.split(' ')[0].trim();
    var lastName = data.name.split(' ')[1].trim();
  }
  let ungradedLabs = data.ungradedAssns;
  let studentModel = {
    firstName,
    lastName,
    dirName: `${firstName}-${lastName[0]}`.toLowerCase(),
    canvasID: data.id,
    ungradedLabs,
  };
  return studentModel;
};



// superagent.get(studentsURL)
// .set('Authorization', `Bearer ${process.env.CANVAS_TOKEN}`)
// .then(res => {
//   return res.body;
// })
// .then((res) => {
//   return students = res.map(element => student(element));
// })
// .catch(err => console.error(err.message));
