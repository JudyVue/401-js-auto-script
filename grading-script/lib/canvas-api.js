'use strict';


module.exports = exports = {};
require('dotenv').config();

//npm modules
const superagent = require('superagent');
const debug = require('debug')('grading-canvas');


//url configs
let perPage = '?per_page=1000';
let canvasURL = `https://canvas.instructure.com/api/v1/courses/${process.env.CANVAS_COURSE_ID}`;
let studentsURL = `${canvasURL}/students`;
let ungradedLabsURL = `${canvasURL}/assignments?bucket=ungraded&${perPage}`;
let sectionURL = `${canvasURL}/sections/${process.env.CANVAS_SECTION_ID}?include[]=students`
let canvasAuthHeader = {Authorization: `Bearer ${process.env.CANVAS_TOKEN}`};
let allLabsURL = `${canvasURL}/assignments${perPage}`;

//config objects
let canvasLabs = {};
let studentSubmissions = [];
let studentStorage = {};


exports.fetchTASection = (arg1, arg2) => {
  if(arg1 === 'show' && arg2 === 'section'){
    superagent.get(sectionURL)
    .set(canvasAuthHeader)
    .then(res => {
      console.log('what?,', res.body.students);
    });
  }
};


exports.postGrade = (arg1, labNumber, studentName, score, comment = ' ') => {
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
      if(student.name.split(' ').length === 1){
        let studentName = student.name.split(' ')[0].trim();
        studentStorage[studentName] = {
          canvasID: student.id,
          first: studentName,
          last: null,
        };
      } else {
        let studentName = `${student.name.split(' ')[0].trim().toLowerCase()}-${student.name.split(' ')[1].trim()[0].toLowerCase()}`;
        studentStorage[studentName] = {
          canvasID: student.id,
          first: student.name.split(' ')[0].trim(),
          last: student.name.split(' ')[1].trim(),
        };
      }
    });
    return studentStorage;
  })
  .then((studentStorage) => studentStorage)
  .then(() => exports.showStudents(arg1, arg2))
  .then(() => exports.fetchUngradedLabs())
  .then(() => exports.showAssignments(arg1, arg2))
  .then(() => exports.fetchSubmissionsOfEachLab())
  .then(() => exports.showRemainingSubmissions())
  .then(() => exports.postGrade(arg1, arg2, arg3, arg4, arg5))
  .catch((err) => console.error(err.message));
};



exports.fetchUngradedLabs = () => {
  console.log(ungradedLabsURL, 'lala');
  return superagent.get(ungradedLabsURL)
  .set(canvasAuthHeader)
  .then(res =>  {
    let ungraded = JSON.parse(res.text);
    return ungraded;
  })
  .then(assns => assns.map((ass, index) => {
    index++;
    canvasLabs[index] = {
      canvasAssnID: ass.id,
      name: ass.name,
      pointsPossible: ass.points_possible,
    };
  }))
  .catch(err => console.error(err.message));
};
//
exports.fetchSubmissionsOfEachLab = () => {
  return new Promise((resolve, reject) => {
    Object.keys(canvasLabs).forEach(assn => {
      superagent.get(`${canvasURL}/assignments/${canvasLabs[assn].canvasAssnID}/submissions${perPage}`)
      .set(canvasAuthHeader)
      .then(res => {
        studentSubmissions = studentSubmissions.concat(res.body.filter(sub => sub.workflow_state === 'submitted'));
        resolve(studentSubmissions);
      })
      .catch(err => reject(err));
    });
  });
};


// exports.fetchSubmissionsOfEachLab = () => {
//     Object.keys(canvasLabs).forEach((assn) => {
//       superagent.get(`${canvasURL}/assignments/${canvasLabs[assn].canvasAssnID}/submissions${perPage}`)
//       .set(canvasAuthHeader)
//       .then(res => {
//         studentSubmissions = studentSubmissions.concat(res.body.filter(sub => sub.workflow_state === 'submitted'));
//         resolve(studentSubmissions);
//       })
//       .catch(err => console.error(err.message))
//       .then(() => {
//       // console.log(studentSubmissions, 'line 117');
//       studentSubmissions = studentSubmissions.map(sub => {
//         let subObj = {
//           assnID: sub.assignment_id,
//           userID: sub.user_id,
//           type: sub.submission_type,
//         };
//         if(sub.preview_url && typeof sub.preview_url !== 'undefined')
//           subObj.canvasURL = sub.preview_url.split('?')[0].trim();
//         return subObj;
//       });
//       return studentSubmissions;
//     })
//     .then(() => linkAssnNameToSubmissions())
//     .then(() => mapSubmissionsToStudents())
//     .catch(err => console.error(err.message));
//   }


const _linkAssnNameToSubmissions = () => {
  studentSubmissions.forEach(sub => {
    Object.keys(canvasLabs).forEach(assnKey => {
      if(canvasLabs[assnKey].canvasAssnID === sub.assnID) {
        sub.name = canvasLabs[assnKey].name;
        sub.pointsPossible = canvasLabs[assnKey].pointsPossible;
      }
    });
  });
};

// const _mapSubmissionsToStudents = () => {
//   studentSubmissions.forEach(sub => {
//     Object.keys(studentStorage).forEach(student => {
//       //TODO: try to have some kind of key value pairing of num:num, maybe mane submisions property another obj instead of an array
//       if (!studentStorage[student].submissions) studentStorage[student].submissions = [];
//       if(sub.userID === studentStorage[student].canvasID){
//         studentStorage[student].submissions.push(sub);
//       }
//       console.log(student, ':\n', studentStorage[student].submissions);
//     });
//   });
//   return studentStorage;
// };

const _mapSubmissionsToStudents = () => {
  let count = 1;
  studentSubmissions.forEach(sub => {
    Object.keys(studentStorage).forEach(student => {
      if (!studentStorage[student].submissions) studentStorage[student].submissions = {};
      if(sub.userID === studentStorage[student].canvasID){
        if(studentStorage[student].submissions[count])
          count++;

        studentStorage[student].submissions[count] = sub;
      }
      // console.log(student, ':\n', studentStorage[student].submissions);
    });
  });
  return studentStorage;
};

exports.showRemainingSubmissions = (arg1, arg2) => {
  if (arg1 === 'show' && arg2 === 'submissions'){
    console.log(`Remaining submissions: \n ${studentSubmissions}`);
  }
};

const _openCanvasPage = (arg1, arg2) => {
  //if arg1 equals student name, map to the particular canvas URL to open it. Need to key their submissions by a number
}
