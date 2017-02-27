'use strict';

require('dotenv').config();


//app modules
const githubCmd = require('./lib/github-command')


//The ideal URL
//https://canvas.instructure.com/api/v1/courses/1107581/assignments?bucket=ungraded&?per_page=999

//This maps to:
//https://canvas.instructure.com/api/v1/courses/1107581/assignments/5939248/submissions?per_page=1000
//Use this URL to get ungraded assignments


let perPage = '?per_page=1000';
let canvasURL = `https://canvas.instructure.com/api/v1/courses/${process.env.CANVAS_COURSE_ID}`;

let studentsURL = `${canvasURL}/students`

let ungradedLabsURL = `${canvasURL}/assignments?bucket=ungraded&${perPage}`


let canvasAuthHeader = {Authorization: `Bearer ${process.env.CANVAS_TOKEN}`};



const main = () => {
  Promise.all([
    // fetchCanvasStudents(),
    githubCmd.fetchLabRepoURLs(),
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
  .then(students => debug(students, 'student info from canvas'))
  .catch(err => console.log(err.message));
};




let canvasPostURL = 'https://canvas.instructure.com/api/v1/courses/1107581/assignments/5628634/submissions/5545113';


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







main();
