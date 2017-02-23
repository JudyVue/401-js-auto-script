'use strict';

require('dotenv').config();

const superagent = require('superagent');

let startURL = 'https://canvas.instructure.com/api/v1'

let testURL = `${startURL}/courses/${process.env.COURSE_ID}/assignments/5939248/submissions`;

///api/v1/courses/:course_id/modules/:module_id/items

let modulesURL = `${startURL}/courses/${process.env.COURSE_ID}/modules`
let assgnURL = 'https://canvas.instructure.com/api/v1/courses/1107581/assignments?bucket=ungraded&?per_page=999'
let pullRequestLinks = [];

let ghURL = 'https://github.com/codefellows-seattle-javascript-401d14/lab-31-frontend-auth/pull/4'

// superagent.get(assgnURL)
// .set('Authorization', `Bearer ${process.env.CANVAS_TOKEN}`)
// .then(res => {
//   return console.log(res.body);
// })
// .catch(err => console.error(err.message));

superagent.get(ghURL)
.then(res => {
  return console.log(res.text.slice(0, 5000));
})
.catch(err => console.error(err.message));

// superagent.get(testURL)
// .set('Authorization', `Bearer ${process.env.CANVAS_TOKEN}`)
// .then(res => {
//   return pullRequestLinks = res.body.map(assignment => assignment.url);
// })
// .then(links => {
//   console.log(pullRequestLinks, 'did we get links?');
// })
// .catch(err => console.error(err.message));
