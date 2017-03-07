'use strict';


module.exports = exports = {};
require('dotenv').config();

//app modules
const {reverse} = require('../helpers/optimization');

//npm modules
const superagent = require('superagent');
const debug = require('debug')('grading-canvas');


let perPage = '?per_page=1000';
let canvasURL = `https://canvas.instructure.com/api/v1/courses/${process.env.CANVAS_COURSE_ID}`;
let studentsURL = `${canvasURL}/students`;
let ungradedLabsURL = `${canvasURL}/assignments?bucket=ungraded&${perPage}`;
let canvasAuthHeader = {Authorization: `Bearer ${process.env.CANVAS_TOKEN}`};
let canvasLabs = {};
let studentSubmissions = [];
let studentStorage = {};

exports.postGrade = (arg1, labNumber, studentName, score, comment) => {
  if(arg1 === 'grade'){
    debug('postGrade');
    let gradeKey = 'submission[posted_grade]';
    let commentKey = 'comment[text_comment]';
    let url = `${canvasURL}/assignments/${canvasLabs[labNumber].canvasAssnID}/submissions/${studentStorage[studentName].canvasID}/?${gradeKey}=${score}&${commentKey}=${comment}`;

    superagent.put(url)
    .set(canvasAuthHeader)
    .end(err => {
      if(err) return console.error(err.message, 'error');
      console.log('post successful');
    });

  }
};

exports.showStudents = (arg1, arg2) => {
  if (arg1 === 'show' && arg2 === 'students'){
    console.log('Here are your students:\n',studentStorage);
    return;
  }
};

exports.showAssignments = (arg1, arg2) => {
  if(arg1 === 'show' && arg2 === 'ungraded'){
    console.log('Here are ungraded assignments:\n', canvasLabs);
    return;
  }
};


exports.fetchCanvasStudents = (arg1, arg2, arg3, arg4, arg5) => {
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
  .then(() => exports.showStudents(arg1, arg2))
  .then(() => exports.fetchUngradedLabs())
  .then(() => exports.fetchSubmissionsOfEachLab())
  .then(() => exports.showRemainingSubmissions())
  .then(() => exports.showAssignments(arg1, arg2))
  .then(() => exports.postGrade(arg1, arg2, arg3, arg4, arg5))
  .catch((err) => console.error(err.message));
};



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

exports.fetchSubmissionsOfEachLab = () => {
  Object.keys(canvasLabs).forEach((assn) => {
    return superagent.get(`${canvasURL}/assignments/${canvasLabs[assn].canvasAssnID}/submissions${perPage}`)
    .set(canvasAuthHeader)
    .then(res => {
      studentSubmissions = studentSubmissions.concat(...JSON.parse(res.text).filter(sub => sub.workflow_state === 'submitted'));
      return studentSubmissions;
    })
    .then(() => {
      studentSubmissions = studentSubmissions.map(sub => {
        return {
          assn: sub.assignment_id,
          userID: sub.user_id,
          type: sub.submission_type,
          // canvasURL: sub.preview_url.split('?')[0].trim() || null,
        };
      });
      // console.log(studentSubmissions);
    })
    .catch(err => console.error(err.message));
  });
};

// exports.mapSubmissionsToStudents = () => {
//   studentSubmissions.forEach(sub => {
//     Object.keys(studentStorage).forEach(student => {
//       if(sub.user_id === studentStorage[student].canvasID){
//         studentStorage[student].submissions = {
//
//         }
//       }
//     })
//
//   })
// }
exports.showRemainingSubmissions = (arg1, arg2) => {
  if (arg1 === 'show' && arg2 === 'submissions'){
    console.log(`Remaining submissions: \n ${studentSubmissions}`);
  }
};
