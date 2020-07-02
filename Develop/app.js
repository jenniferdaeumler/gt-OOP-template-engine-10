const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const employees = [];

//Question list for inquirer, creates objects for each employee
const questions = [
  {
    type: "list",
    message: "What is your role?",
    name: "role",
    choices: ["Engineer", "Intern", "Manager"],
  },
  {
    type: "input",
    message: "What is your name?",
    name: "name",
  },
  {
    type: "input",
    message: "What is your ID?",
    name: "id",
  },
  {
    type: "input",
    message: "What is your email?",
    name: "email",
  },
  {
    type: "input",
    message: "What is your GitHub username?",
    name: "github",
    when: (response) => response.role === "Engineer",
  },
  {
    type: "input",
    message: "What school did you attend?",
    name: "school",
    when: (response) => response.role === "Intern",
  },
  {
    type: "input",
    message: "What is your office number?",
    name: "officeNumber",
    when: (response) => response.role === "Manager",
  },
  {
    type: "list",
    message: "Do you want to add another employee?",
    name: "add",
    choices: ["Yes", "No"],
  },
];

//Inquirer init
const init = () => inquirer
  .prompt(questions)
  //Role selected creates new object specific to role
  .then(createTeam);

//Function that adds all team info to specific employee
function createTeam(response) {
  let employee;
  if (response.role === "Engineer") {
    employee = new Engineer(
      response.name,
      response.id,
      response.email,
      response.github
    );
  } else if (response.role === "Intern") {
    employee = new Intern(
      response.name,
      response.id,
      response.email,
      response.school
    );
  } else if (response.role === "Manager") {
    employee = new Intern(
      response.name,
      response.id,
      response.email,
      response.officeNumber
    );
  }
  //Blank array pushed with employee responses
  employees.push(employee);
  console.log(employees);

  if (response.add === "Yes") {
    inquirer.prompt(questions).then(createTeam);
  } else {
    console.log("Finished");
  }
  fs.writeFile(outputPath, render(employees), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("Sucess");
  });
}
init();


// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
