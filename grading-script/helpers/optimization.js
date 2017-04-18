'use strict';

//this module is full of helper functions that will replace built in array sorting functions with faster iterations, i.e. replacing JavaScript's built-in reverse method with a different reverse method


module.exports = exports = {};

//replacing JS's built-in reverse with swap reverse for faster performance, as determined by http://jsperf.com/js-array-reverse-vs-while-loop/5
exports.reverse = (arr) => {
  let left = null;
  let right = null;
  let temp;
  for(left = 0; left < arr.length / 2; left++){
    right = arr.length - 1 - left;
    temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
  }
  return arr;
};

exports.sortStudents = (arr) => {
  return arr.sort((a, b) =>{
    let lowA = a.name.toLowerCase();
    let lowB= b.name.toLowerCase();
    if (lowA < lowB) return -1;
    if (lowA > lowB) return 1;
    return 0;
  });
}

exports.setStudentStorage = (arr, obj) => {
  arr.map(student => {
    if(student.name.split(' ').length === 1){
      let studentName = student.name.split(' ')[0].trim();
      obj[studentName] = {
        canvasID: student.id,
        first: studentName,
        last: null,
      };
    } else {
      let studentName = `${student.name.split(' ')[0].trim().toLowerCase()}-${student.name.split(' ')[1].trim()[0].toLowerCase()}`;
      obj[studentName] = {
        canvasID: student.id,
        first: student.name.split(' ')[0].trim(),
        last: student.name.split(' ')[1].trim(),
      };
    }
  });
  return obj;
}
