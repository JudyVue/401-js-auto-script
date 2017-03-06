2/24/16 New Plan, ditching the Canvas API for now
1. Use Github API instead
2. Git clone the main codefellows lab repo
3. When PRs are submitted, you can just run following git command:
  * git fetch origin pull/<pull-number>/head:<gh-username>
    **/head:<gh-username> checks out a new branch that contains that student's current work


1. Clone lab github repo


2/22/16
1. Generate list (array) of students and their ungraded lab assignments.
   * Set up each student as their own model in the form of constructor (or factory fn for a more fn program approach)
   * Properties needed:
      a. student's first name
      b. student's last name
      c. student's first-name and last initial (to create dirs like "david-a" and "david-b" if a class has two students w/ same name)
      d. student's Canvas ID#
      e. ungraded labs: an array of student's ungraded labs in the form of their GH repo URL for cloning (remember to append with '.git')   https://github......        
        1e. Still deciding if just use parsed out URL as array element, or make a whole other object in the form of:
          {
            gh-url: foo,
            assgn-canvas-id: num,
            name of lab: (i.e. 'lab-36....')
          }
      f. ungraded readings: an array of student's ungraded readings (for stretch goal to just run another Node script that automatically grades students' readings)
      g. github-username

//Students looks like this
{ 'david-p': { canvasID: 5544988, first: 'David', last: 'Porter' },
 'devon-h': { canvasID: 5826283, first: 'Devon', last: 'Hackley' },
 'geno-g': { canvasID: 5816167, first: 'Geno', last: 'Guerrero' },
 'irvine-d': { canvasID: 5638002, first: 'Irvine', last: 'Downing' },
 'jaren-e': { canvasID: 5920591, first: 'Jaren', last: 'Escueta' },
 'kenneth-e': { canvasID: 5545113, first: 'Kenneth', last: 'Edwards' },
 'stephen-a': { canvasID: 5833881, first: 'Stephen', last: 'Anderson' },
 'thomas-m': { canvasID: 5603377, first: 'Thomas', last: 'Martinez' } }

 ungraded assignments look like this
 { '1': { canvasAssnID: 5628635, name: 'Read: Streams' },
  '2': { canvasAssnID: 5939286, name: 'Code Lab 36 and Beyond - Slog' } }
