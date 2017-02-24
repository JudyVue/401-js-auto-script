'use strict';

require('dotenv').config();

const Promise = require('bluebird');
const childProcess = Promise.promisifyAll(require('child_process'));


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


return childProcess.execAsync('git clone https://github.com/codefellows-seattle-javascript-401d14/lab-31-frontend-auth.git')
.then(() => {
  console.log('success!');
}).catch(err => {
  console.error(err);
});
