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
