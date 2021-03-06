const inquirer = require('inquirer');

const table = require('console.table');
const connection = require('./db/connection');

 const prompt = require('./lib/questions')
require('console.table');


 startApp();
  //init app
 function startApp() {
console.log('start');

  inquirer  
    .prompt(prompt.prompt)
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
            case "View Employees by Manager":
                viewEmployeeByManager();
                break;
            case "View Employees by Department":
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
            case "Update employee manager":
                updateEmployeeManager();
                break;
        //delete function calls
            case "delete Employee":
                deleteEmployee();
                break;
            case "delete Role":
                deleteRole();
                break;
            case "delete Department":
                deleteDepartment();
                break;
        //exit function call
            case "exit":
                console.log('bye')
                connection.end();
                break;
        }
    });
};

//-----------------show departments

function viewDepartments() {
	var sql = "SELECT * FROM department";
	connection.query(sql, function (err, res) {
		if (err) throw err;
		console.log(`\nDEPARTMENTS:\n`);
		console.table(res);
		// res.forEach((department) => {
		// console.log(`ID: ${department.id} | ${department.title} Department`);
		// });
		startApp();
	});
}

//-------------------show roles
function viewRoles() {
	var sql = "SELECT * FROM roles";
	connection.query(sql, function (err, res) {
		if (err) throw err;
		console.log(`\nROLES:\n`);
		console.table(res);
		// res.forEach((role) => {
		// console.log(
		// `ID: ${role.id} | Title: ${role.title}\n Salary: ${role.salary}\n`,
		// );
		// });
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

	connection.query(sql, function (err, res) {
		if (err) throw err;
		console.table(res);
		startApp();
	});
}

//---------------show employee by manager
function viewEmployeeByManager() {
	var sql = `SELECT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN roles r
	ON e.role_id = r.id
  	LEFT JOIN department d
  	ON d.id = r.department_id
  	LEFT JOIN employee m
	ON m.id = e.manager_id GROUP BY e.manager_id`;

	connection.query(sql, function (err, res) {
		if (err) throw err;

		// Select manager to view employee
		const managerChoices = res
			.filter((mgr) => mgr.manager_id)
			.map(({ manager_id, manager }) => ({
			value: manager_id,
			name: manager,
			}));

		inquirer
			.prompt(prompt.viewEmployeeByManager(managerChoices))
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

		   connection.query(sql, answer.managerId, function (err, res) {
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

	var sql = `SELECT d.id, d.title
	FROM employee e
	LEFT JOIN roles r
	ON e.role_id = r.id
	LEFT JOIN department d
	ON d.id = r.department_id
	GROUP BY d.id, d.title`;

	connection.query(sql, function (err, res) {
		if (err) throw err;

		// Select department
		const departmentChoices = res.map((data) => ({
			value: data.id,
			name: data.name,
		}));

		inquirer
			.prompt(prompt.viewEmployeeByDpt(departmentChoices))
			.then(function (answer) {
				var sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.title AS department 
			FROM employee e
			JOIN roles r
				ON e.role_id = r.id
			JOIN department d
			ON d.id = r.department_id
			WHERE d.id = ?`;

			connection.query(sql, answer.departmentId, function (err, res) {
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
	connection.query(sql, answer.department, function (err, res) {
	if (err) throw err;
	console.log(
	`added department: ${answer.department.toUpperCase()}.`,
	);
	});

	viewDepartments();
	});
}

//--------add role
function addRole() {
	var sql = `SELECT * FROM department`;

	connection.query(sql, function (err, res) {
	if (err) throw err;
	// Select department for role
	const departmentChoices = res.map(({ id, title }) => ({
	value: id,
	name: `${id} ${title}`,
	}));

	inquirer
		.prompt(prompt.insertRole(departmentChoices))
		.then(function (answer) {
		var sql = `INSERT INTO roles SET ?`;
		// Insert Title, Salary and Department into Role Array
				connection.query(
					sql,
					{
						title: answer.roleTitle,
						salary: answer.roleSalary,
						department_id: answer.departmentId,
					},
					function (err, res) {
						if (err) throw err;
						console.log("\n" + res.affectedRows + " role created");

		viewRoles();},
	   );
	});
});
}

//------------------------------------------------add employee
const addEmployee = () => {
	//pick Employee's Department
	let departmentArray = [];
	connection.query(`SELECT * FROM department`, (err, res) => {
	if (err) throw err;

	res.forEach((element) => {
	departmentArray.push(`${element.id} ${element.name}`);
	});

	// pick Employee's Role
	let roleArray = [];
	connection.query(`SELECT id, title FROM roles`, (err, res) => {
	if (err) throw err;

	res.forEach((element) => {
	roleArray.push(`${element.id} ${element.title}`);
	});

	// pick Employee's Manager
	let managerArray = [];
	connection
    .query(`SELECT id, first_name, last_name FROM employee`,
        (err, res) => {
		if (err) throw err;
		res.forEach((element) => {
		managerArray.push(
		`${element.id} ${element.first_name} ${element.last_name}`,);
		});

	// Create New Employee
	inquirer
		.prompt(prompt.addEmployee(departmentArray, roleArray, managerArray),)
		.then((response) => {
		// Insert elements into employee array
		let roleCode = parseInt(response.role);
		let managerCode = parseInt(response.manager);
		connection.query("INSERT INTO employee SET ?",
			{
			first_name: response.firstName,
			last_name: response.lastName,
			role_id: roleCode,
			manager_id: managerCode,
			},
			(err, res) => {
			if (err) throw err;
			console.log("\n" + res.affectedRows + " employee created");	
		startApp();
							},
						);
					});
				},
			);
		});
	});
};

//-----------------------------update role
const updateEmployee = () => {
// Select Employee
    let employees = [];
	connection.query(
	`SELECT id, first_name, last_name
     FROM employee`,
	(err, res) => {
	if (err) throw err;

	res.forEach((element) => {	employees.push(
        `${element.id} ${element.first_name} ${element.last_name}`,
			);
			});
        
// pick new role
    let job = [];
	connection.query(`SELECT id, title FROM roles`, (err, res) => {
	if (err) throw err;
		res.forEach((element) => {
		job.push(`${element.id} ${element.title}`);
		});

	inquirer
    .prompt(prompt.updateRole(employees, job))
    .then((response) => {
		// change Role
		let idCode = parseInt(response.update);
		let roleCode = parseInt(response.role);
		connection.query(
		`UPDATE employee SET role_id = ${roleCode} WHERE id = ${idCode}`,
		(err, res) => {
		if (err) throw err;

		console.log("\n" + "\n" + res.affectedRows + " Updated successfully!",);
	
    startApp();
	},
   );
  });
 });
},
);
};

//================================update manager
const updateEmployeeManager = () => {
// pick a member to update
	let employees = [];
	connection.query(
    `SELECT id, first_name, last_name
     FROM employee`,
	 (err, res) => {
	 res.forEach((element) => {
// for each ID and Name push into array
	employees.push(
	`${element.id} ${element.first_name} ${element.last_name}`,);
    });
			
// pick employee's new manager
	inquirer
    .prompt(prompt.updateManager(employees))
    .then((answer) => {
// parseInt prompt answers
	let idCode = parseInt(answer.update);
	let managerCode = parseInt(answer.manager);
	connection.query(
// replace employee's mgr_ID with emp_ID of new manager
	`UPDATE employee SET manager_id = ${managerCode} WHERE id = ${idCode}`,
	(err, res) => {
	if (err) throw err;

	console.log("\n" + "\n" + res.affectedRows + " Updated successfully!",);
						
	startApp();
	},
	);
   });
  },
);
};

//======================delete employee
function deleteEmployee() {
	console.log("Delete employee");
	var sql = `SELECT e.id, e.first_name, e.last_name
               FROM employee e`;

	connection.query(sql, function (err, res) {
		if (err) throw err;
		// pick Employee 
		const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
			value: id,
			name: `${id} ${first_name} ${last_name}`,
		}));

		inquirer
		    .prompt(prompt.deleteEmployee(deleteEmployeeChoices))
			.then(function (answer) {
			var sql = `DELETE FROM employee WHERE ?`;
			// remove employee from the db
			connection.query(sql, { id: answer.employeeId }, function (err, res) {
			if (err) throw err;

			console.log("\n" + res.affectedRows + " employee deleted");
			

			startApp();
		});
	  });
	});
}

//=========================delete department
function deleteDepartment() {
	console.log("\ndelete Department:\n");

	var sql = `SELECT e.id, e.title FROM department e`;

	connection.query(sql, function (err, res) {
		if (err) throw err;
		// Select Department to Remove
		const deleteDepartmentChoices = res.map(({ id, title }) => ({
			value: id,
			name: `${id} ${title}`,
		}));

		inquirer
			.prompt(prompt.deleteDepartment(deleteDepartmentChoices))
			.then(function (answer) {
			var sql = `DELETE FROM department WHERE ?`;
			// delete item from the db
			connection.query(sql, { id: answer.departmentId },
            function (err,res,) {
					if (err) throw err;

					console.log("\n" + res.affectedRows + " department deleted");
					
					startApp();
				});
			});
	});
}

//======================delete role
function deleteRole() {
	console.log("Deleting a roles");

	var sql = `SELECT e.id, e.title, e.salary, e.department_id FROM roles e`;

	connection.query(sql, function (err, res) {
	if (err) throw err;
	// pick a role 
	const deleteRoleChoices = res.map(({ id, title }) => ({
			value: id,
			name: `${id} ${title}`,
		    }));

	inquirer
		.prompt(prompt.deleteRole(deleteRoleChoices))
		.then(function (answer) {
		var sql = `DELETE FROM roles WHERE ?`;
		// delete item from the db
		connection.query(sql, { id: answer.roleId }, function (err, res) {
		if (err) throw err;

		console.log("\n" + res.affectedRows + " role deleted");

	startApp();
	});
	});
  });
}
