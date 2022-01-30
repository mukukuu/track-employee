

module.exports = {

    //init
    prompt: {
       name: 'action',
       type: 'list',
       message: 'Menu',
       choices:[
           "view all department",
           "view all roles",
           "view all employees",
           "View Employees by Manager",
           "View Employees by Department",

           "add a department",
           "add a role",
           "add an employee",

           "update an employee role",
           "Update employee manager",

           "delete Employee",
           "delete Department",
           "delete Role", 

           "exit",
       ],
    },
       viewEmployeeByManager: (managerChoices) => [
		// Select Manager
		{
			type: "list",
			name: "managerId",
			message: "Which manager will you choose?",
			choices: managerChoices,
		},
	],
       viewEmployeeByDpt: (departmentChoices) => [
		// Select Department
		{
			type: "list",
			name: "departmentId",
			message: "Which department will you choose?",
			choices: departmentChoices,
		},
	],

    //======add
    addEmployee: (departmentArray, roleArray, managerArray) => [
		// Create Employee's First Name
		{
			name: "firstName",
			type: "input",
			message: "Enter employee's first name:",
		},
		// Create Employee's Last Name
		{
			name: "lastName",
			type: "input",
			message: "Enter employee's last name:",
		},
		// Select Employee's Department
		{
			name: "department",
			type: "list",
			message: "Choose employee's department",
			choices: departmentArray,
		},
		// Select Employee's Role
		{
			name: "role",
			type: "list",
			message: "Choose employee's job position",
			choices: roleArray,
		},
		// Select Employee's Manager
		{
			name: "manager",
			type: "list",
			message: "Choose the manager of this employee:",
			choices: managerArray,
		},
	],

    insertDepartment: {
		// Create New Departments Name
		name: "department",
		type: "input",
		message: "What is the name of the new department?",
	},

    insertRole: (departmentChoices) => [
		// Create New Role's Name
		{
			type: "input",
			name: "roleTitle",
			message: "assign a role",
		},
		// Create New Role's Salary Budget
		{
			type: "input",
			name: "roleSalary",
			message: "add salaryy",
		},
		// Select New Role's Department
		{
			type: "list",
			name: "departmentId",
			message: "assign a Department",
			choices: departmentChoices,
		},
	],

    //=======update
    updateManager: (employees) => [
		{
            //select employee
			name: "update",
			type: "list",
			message: "update manage of selected employee",
			choices: employees,
		},
		// Select Employee's New Manager
		{
			name: "manager",
			type: "list",
			message: "update manager",
			choices: employees,
		},
	],

    updateRole: (employees, job) => [
		// Select Employee to Update
		{
			name: "update",
			type: "list",
			message: "update role",
			choices: employees,
		},
		// Select Employee's New Role
		{
			name: "role",
			type: "list",
			message: "update role",
			choices: job,
		},
	],

//=====delete
    deleteDepartment: (deleteDpt) => [
    // Select Department to Remove
       {
            type: "list",
            name: "departmentId",
            message: "Select a department to delete",
            choices: deleteDpt,
        },
    ],
    deleteRole: (deleteR) => [
		// Select Role to Remove
		{
			type: "list",
			name: "roleId",
			message: "Select a role to delete",
			choices: deleteR,
		},
	],
    deleteEmployee: (deleteEm) => [
		// Select Employee to Remove
		{
			type: "list",
			name: "employeeId",
			message: "Select an employee to delete",
			choices: deleteEm,
		},
	],

};