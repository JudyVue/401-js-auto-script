'use strict';


module.exports = exports = {};
require('dotenv').config();

const superagent = require('superagent');
const debug = require('debug')('grading-canvas');

let canvasPostURL = 'https://canvas.instructure.com/api/v1/courses/1107581/assignments/5628634/submissions/5545113';
let perPage = '?per_page=1000';
let canvasURL = `https://canvas.instructure.com/api/v1/courses/${process.env.CANVAS_COURSE_ID}`;

let studentsURL = `${canvasURL}/students`

let ungradedLabsURL = `${canvasURL}/assignments?bucket=ungraded&${perPage}`

let canvasAuthHeader = {Authorization: `Bearer ${process.env.CANVAS_TOKEN}`};

let canvasLabs = [];
let studentSubmissions = [];


exports.postGrade = (score, comment = null) => {
  debug('postGrade');
  let gradeKey = 'submission[posted_grade]';
  let commentKey = 'comment[text_comment]';
  superagent.put(`${canvasPostURL}/?${gradeKey}=${score}&${commentKey}=${comment}`)
  .set(canvasAuthHeader)
  .end(err => {
    if(err) return debug(err.message, 'error');
    debug('post successful');
  });
};

exports.fetchCanvasStudents = () => {
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

//The ideal URL
//https://canvas.instructure.com/api/v1/courses/1107581/assignments?bucket=ungraded&?per_page=999

//This maps to:
//https://canvas.instructure.com/api/v1/courses/1107581/assignments/5939248/submissions?per_page=1000
//Use this URL to get ungraded assignments

//submission_types: [ 'online_text_entry', 'online_url' ],
exports.fetchUngradedLabs = () => {
  return superagent.get(ungradedLabsURL)
  .set(canvasAuthHeader)
  .then((res) => JSON.parse(res.text))
  .then(assignments => {
    return assignments.filter((ass) => {
      return ass.submission_types.includes('online_url');
    })
    .map(ass => ({canvasAssnID: ass.id, name: ass.name}));
  })
  .then(assns => canvasLabs = assns)
  .catch((err) => console.log(err.message));
};


//https://canvas.instructure.com/api/v1/courses/1107581/assignments/5939248/submissions?per_page=1000
exports.fetchSubmissionsOfEachLab = () => {
  canvasLabs.forEach((assn) => {
    superagent.get(`${canvasURL}/assignments/${assn.canvasAssnID}/submissions${perPage}`)
    .set(canvasAuthHeader)
    .then(res => {
      studentSubmissions = studentSubmissions.concat(...JSON.parse(res.text));
      return studentSubmissions;
    })
    .then(submissions => console.log(submissions));
  });
};


//THis is the endpoint to PUT to to score a student's assn
//PUT /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id
//'https://canvas.instructure.com/api/v1/courses/1107581/assignments/5628634/submissions/5545113';
// return exports.fetchUngradedLabs()
// .then(() => exports.fetchSubmissionsOfEachLab());
