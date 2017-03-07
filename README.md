#Automatic Cloning Script for TA's of Codefellows Advanced JavaScript 401

This is a script that automatically clones and pulls down pull request submissions of students' labs. These docs will become more robust in the future as I build up this app. As of March 6, 2017, the following commands exist:


##Cloning Down the Most Recent Lab
```
npm run start
```

Clones the most recent lab and pulls down the PRs. Students' PRs are formed into their own branches according to their pull number, saving the TA the space of having different folders for each student's cloned repo.


##Showing all Previous Labs
```
npm run list-labs
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


##Cloning Down a Previous Lab that isn't the Most Recent
 ```
 npm run start <number>
 ```

This will pull down ``https://github.com/codefellows-seattle-javascript-401d14/lab-31-frontend-auth.git``.


##Showing Student Names
```
npm run show-students
```
This will show you a list of student names with their relevant Canvas ID.

```
 { 'david-p': { canvasID: 5544988, first: 'David', last: 'Porter' },
  'devon-h': { canvasID: 5826283, first: 'Devon', last: 'Hackley' },
  'geno-g': { canvasID: 5816167, first: 'Geno', last: 'Guerrero' },
  'irvine-d': { canvasID: 5638002, first: 'Irvine', last: 'Downing' },
  'jaren-e': { canvasID: 5920591, first: 'Jaren', last: 'Escueta' },
  'kenneth-e': { canvasID: 5545113, first: 'Kenneth', last: 'Edwards' },
  'stephen-a': { canvasID: 5833881, first: 'Stephen', last: 'Anderson' },
  'thomas-m': { canvasID: 5603377, first: 'Thomas', last: 'Martinez' } }
```

##Showing Ungraded Assignments
```
npm run show-ungraded
```
This will show you a list of ungraded assignments (NOTE: It does not yet account for how many students have submitted to this assignment). 

```
{ '1': { canvasAssnID: 5939286, name: 'Code Lab 36 and Beyond - Slog' } }
```
In the above example, I have one ungraded assignment left called ``Code Lab 36 and Beyond - Slog``. However, I do not know how many students have submitted to this assignment (this will be modified as I attempt to map students' Canvas ID numbers with their specific assignment submissions). The number ``1`` denotes that it is the most recently submitted assignment according to the most recent date. If a student submits a different assignment ``Code Lab Foo``, then ``Code Lab 36 and Beyond - Slog`` will move down to position No. 2 and ``Code Lab Foo`` will be at position No. 1. 


##Posting a Grade to a Student's Submission
```
npm run grade <labNumber> <student-name> <score> <comment>
```

This command will post a student's grade to Canvas directly from the terminal. For example, if I wanted to post a score to David Porter's Code Lab 36, I would do the following:

```
npm run grade 1 david-p 30 "great job"
```

The number ``1`` maps back to the JSON object returned from the command ``npm show-ungraded``. Typing ``david-p`` maps back to the JSON object that displays my list of students with their Canvas ID numbers. The ``score`` is a number and the ``comment`` is an additonal comment to post to Canvas. The comment **MUST** be in double quotes on the terminal. If no comment is sent, the literal word **undefined** is posted on the student's Canvas. 


###Stretch Goals for this script

1. Utilize a database to hold all the information collected from multiple API calls, or at least do more memoization so that a command doesn't start all over with expensive API calls. 

2. Modify  my ``makeStudentGitBranches`` function in the ``github-command`` module to use the Github API for PR info. I want this specific information in order to create better-named branches for each student. Right now, each branch name is just numbered `1, 2, 3...`, etc, causing a TA to have to hunt through the code for hints on which student this code belongs to, assuming the student did not make a directory named ``lab-<name>``. I would like to change this to make the branch name the student's Gitub username.

3. In addition to the above, using the Github API request will also ensure I only grab open PRs. Currently, my function iterates recursively with a counter starting at 1. It increments through the PR numbers to pull down the labs until there are none. While this works, it also pulls down PRs that are closed, since closed PRs still have a PR number attached to them. I.e. if ``pull request No. 7`` is a closed PR, my script still grabs that PR and makes a branch, which is a waste.

4. Map submissions to student's names, while displaying a list of points possible for the assignment so that a TA doesn't need to go to Canvas to confirm how many max points an assignment is worth (defeating the purpose of just staying within the CLI tool for all Canvas work).

5. Tying with No. 4, include a command to show posts of students' reading assignments. A stretch goal would be to color any posts containing a question with read so a TA knows to respond specifically to that student's question. 

6. Utilize built-in ``open <url`` commands with Node's ``child_process.exec`` functionality. Certain people will understandably be annoyed at using the CLI and would prefer using Canvas's online interface. My hope is that they can just execute a command to open a particular student's Canvas page so they can just post their grade and comments directly online in the browser if a user is more comfortable using the browser instead.

7. Do the same thing with opening a Github page so that the browser can automatically open to a student's ``Files Changed`` URL on their pull request. 

8. Do not limit the assignments to ungraded. Right now, my script only shows the ungraded assignments as the idea is a TA only needs to do work on an assignment that isn't graded. However, mistakes can happen, and we may change our minds and want to edit a student's submitted grade. Right now, this is not possible, but I can change things around. 

9. Allow a TA can pull down any previous lab without having to automatically pull down the most recent lab. I.e., if they want to run ``npm run start 2`` to pull down the second-to-most-previous lab, they'll still have to pull down the most recent lab anyway. 
