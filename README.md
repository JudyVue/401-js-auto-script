#Automatic Cloning Script for TA's of Codefellows Advanced JavaScript 401

This is a script that automatically clones and pulls down pull request submissions of students' labs. These docs will become more robust in the future as I build up this app. For now, the following commands exist:

```
npm run start
```

Clones the most recent lab and pulls down the PRs. Students' PRs are formed into their own branches, saving the TA the space of having different folders for each student's cloned repo.

``
npm run start list labs
```

My version of ``ls``. This command will log a numbered list of the previous labs, with ``1`` being the most recent. The list comes back as a JSON object in the following form:

```
{ '1': 'https://github.com/codefellows-seattle-javascript-401d14/lab-36-and-beyond-slog.git',
 '2': 'https://github.com/codefellows-seattle-javascript-401d14/lab-31-frontend-auth.git',
 '3': 'https://github.com/codefellows-seattle-javascript-401d14/lab-29-ng-adventure.git',
 '4': 'https://github.com/codefellows-seattle-javascript-401d14/lab-28-sass-base.git',
 '5': 'https://github.com/codefellows-seattle-javascript-401d14/lab-27-cowsay-testing.git',
 '6': 'https://github.com/codefellows-seattle-javascript-401d14/lab-26-cowsay-app.git',
 '7': 'https://github.com/codefellows-seattle-javascript-401d14/lab-16-19-cf-gram.git',
 '8': 'https://github.com/codefellows-seattle-javascript-401d14/lab-13-14-mongo-express.git',
 '9': 'https://github.com/codefellows-seattle-javascript-401d14/lab-11-12-express-api.git',
 '10': 'https://github.com/codefellows-seattle-javascript-401d14/lecture-08-node-api.git',
 '11': 'https://github.com/codefellows-seattle-javascript-401d14/lab-07-cowsay-http-server.git',
 '12': 'https://github.com/codefellows-seattle-javascript-401d14/lab-06-wack-chat.git',
 '13': 'https://github.com/codefellows-seattle-javascript-401d14/lab-04-bitmap.git',
 '14': 'https://github.com/codefellows-seattle-javascript-401d14/lab-03-readfiles.git',
 '15': 'https://github.com/codefellows-seattle-javascript-401d14/lab-01-modular-patterns.git' }
 ```

 If there is a previous lab you would like to pull down, enter the following command with the appropriate lab number. For example:

 ```
 npm run start <number>
 ```

This will pull down ``https://github.com/codefellows-seattle-javascript-401d14/lab-31-frontend-auth.git``.

##Stretch Goals for this script

1. Have the ability to post a grade and comment to a student's Canvas submission using their API. Right now, I actually *can* do that, but only with a hard-coded and very specific endpoint. The structure of Canvas's API is notoriously poor. Generating the necessary ID numbers for the particular endpoint requires at least two API calls to the Canvas API. This will then require a few iterations through the data to cross-reference it with the data received from the Github API in order to map the pieces together cohesively.

2. Utilize a database to hold all the information collected from multiple API calls.

3. Modify  my ``makeStudentGitBranches`` function in the ``github-command`` module to use the Github API for PR info. I want this specific information in order to create better-named branches for each student. Right now, each branch name is just numbered `1, 2, 3...`, etc, causing a TA to have to hunt through the code for hints on which student this code belongs to, assuming the student did not make a directory named ``lab-<name>``. I would like to change this to make the branch name the student's Gitub username.

4. In addition to the above, using the Github API request will also ensure I only grab open PRs. Currently, my function iterates recursively with a counter starting at 1. It increments through the PR numbers to pull down the labs until there are none. While this works, it also pulls down PRs that are closed, since closed PRs still have a PR number attached to them. I.e. if ``pull request No. 7`` is a closed PR, my script still grabs that PR and makes a branch, which is a waste.

5. I may or may not utilize Phantom.js and Casper to manipulate the browser in the terminal, so that TAs' grading can solely be done through the terminal (which speaks to the poor UX of Canvas itself). Also, because I think web scraping is dope. However, this is way too much work that may be pointless, given the likelihood that Canvas may change their HTML around drastically in the future (God, let's hope so). 
