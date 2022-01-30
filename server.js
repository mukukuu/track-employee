const inquirer = require('inquirer');
const table = require('console.table');
const connection = require('./db/connection');


 const prompt = require('./lib/questions')
require('console.table');

 startApp();

 function startApp() {
 

 //multiple choice question for user's action 
  inquirer  
    .prompt(prompt.startApp)
    .then(function ({ action }) {

        switch (action) {
        //view function calls
            case "view all department":
                viewDepartments();
                break;
            case "view all roles":
                viewRoles();
                break;
            case "view all employees":
                showEmployee();
                break;
            case "view employees by manager":
                viewEmployeeByManager();
                break;
            case "view employee by department":
                viewEmployeeByDpt();
                break;

        //add function calls
            case "add a department":
                addDepartment();
                break;
            case "add a role":
                addRole();
                break;
            case "add an employee":
                addEmployee();
                break;
        //update function calls
            case "update an employee role":
                updateEmployee();
                break;
            case "update employee manager":
                updateEmployeeManager();
                break;
        //delete function calls
            case "delete employee":
                deleteEmployee();
                break;
            case "delete role":
                deleteRole();
                break;
            case "delete department":
                deleteDepartment();
                break;
        //exit function call
            case "EXIT":
                console.log('bye')
                connection.end();
                break;
        }
    });
   };

//-----------------show departments
viewDepartments();
function viewDepartments() {
	var sql = "SELECT * FROM department";
	connection.sql(sql, function (err, res) {
		if (err) throw err;
		console.log(`\nDEPARTMENTS:\n`);
		res.forEach((department) => {
		console.log(`ID: ${department.id} | ${department.name} Department`);
		});
		startAppt();
	});
}

//-------------------show roles
function viewRoles() {
	var sql = "SELECT * FROM roles";
	connection.sql(sql, function (err, res) {
		if (err) throw err;
		cconsole.log(`\nROLES:\n`);
		res.forEach((role) => {
		console.log(
		`ID: ${role.id} | Title: ${role.title}\n Salary: ${role.salary}\n`,
		);
		});
		startApp();
	});
}

//-----------------show employee
function showEmployee() {
	var sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.title AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN roles r
	ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
	ON m.id = e.manager_id`;

	connection.sql(sql, function (err, res) {
		if (err) throw err;
		console.table(res);
		startApp();
	});
}

//---------------show employee by manager
function viewEmployeeByManager() {
	var sql = `SELECT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN role r
	ON e.role_id = r.id
  	LEFT JOIN department d
  	ON d.id = r.department_id
  	LEFT JOIN employee m
	ON m.id = e.manager_id GROUP BY e.manager_id`;

	connection.sql(sql, function (err, res) {
		if (err) throw err;

		// Select manager to view employee
		const managerChoices = res
			.filter((mgr) => mgr.manager_id)
			.map(({ manager_id, manager }) => ({
			value: manager_id,
			name: manager,
			}));

		inquirer
			.prompt(prompt.viewManagerPrompt(managerChoices))
			.then(function (answer) {
				var sql = `SELECT e.id, e.first_name, e.last_name, r.title, CONCAT(m.first_name, ' ', m.last_name) AS manager
			FROM employee e
			JOIN roles r
			ON e.role_id = r.id
			JOIN department d
			ON d.id = r.department_id
			LEFT JOIN employee m
			ON m.id = e.manager_id
			WHERE m.id = ?`;

		   connection.sql(sql, answer.managerId, function (err, res) {
			if (err) throw err;
			console.table("\nManager's subordinates:", res);

			startApp();
			});
		});
	});
}


//----------------view employee by department
function viewEmployeeByDpt() {
	console.log("View employees by department\n");

	var sql = `SELECT d.id, d.name
	FROM employee e
	LEFT JOIN roles r
	ON e.role_id = r.id
	LEFT JOIN department d
	ON d.id = r.department_id
	GROUP BY d.id, d.title`;

	connection.sql(sql, function (err, res) {
		if (err) throw err;

		// Select department
		const departmentChoices = res.map((data) => ({
			value: data.id,
			name: data.name,
		}));

		inquirer
			.prompt(prompt.departmentPrompt(departmentChoices))
			.then(function (answer) {
				var sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.title AS department 
			FROM employee e
			JOIN roles r
				ON e.role_id = r.id
			JOIN department d
			ON d.id = r.department_id
			WHERE d.id = ?`;

			connection.sql(sql, answer.departmentId, function (err, res) {
			if (err) throw err;
			console.table("\nDepartment Rota: ", res);
			startApp();
			});
		});
	});
}

//-------add department
function addDepartment() {
	inquirer.prompt(prompt.insertDepartment).then(function (answer) {
	var sql = "INSERT INTO department (title) VALUES ( ? )";
	connection.sql(sql, answer.department, function (err, res) {
	if (err) throw err;
	console.log(
	`added department: ${answer.department.toUpperCase()}.`,
	);
	});

	viewDepartments();
	});
}