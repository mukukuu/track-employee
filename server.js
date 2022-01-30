const express = require('express');
const db = require('./db/connection');
const inquirer = require('inquirer');
const CTable = require('console.table');
const questions = require('./lib/questions');

require('dotenv').config();

 const prompt = require('./lib/questions')
 startApp();

 function startApp() {
 }

 //multiple choice question for user's action
function questionPrompts() {
  inquirer  
    .prompt(prompt.startApp)
    .then(function ({ action }) {

        switch (action) {
            case "view all department":
                viewDepartment.showDepartment(questions);
                break;
            case "view all roles":
                viewRoles.showRoles(questions);
                break;
            case "view all employees":
                viewEmployees.showEmployees(questions);
                break;
            case "add a department":
                addDepartment.createDepart(questions);
                break;
            case "add a role":
                addRole.createRole(questions);
                break;
            case "add an employee":
                addEmployee.createEmployee(questions);
                break;

            case "update an employee role":
                updateEmployee.updateRole(questions);
                break;
        }
    });
   };
questionPrompts();

//show departments
function viewDepartments() {
	var query = "SELECT * FROM department";
	connection.query(query, function (err, res) {
		if (err) throw err;
		console.log(`\nDEPARTMENTS:\n`);
		res.forEach((department) => {
			console.log(`ID: ${department.id} | ${department.name} Department`);
		});
		
		startAppt();
	});
}

//show roles
function viewRoles() {
	var query = "SELECT * FROM role";
	connection.query(query, function (err, res) {
		if (err) throw err;
		console.log(`\nROLES:\n`);
		res.forEach((role) => {
			console.log(
				`ID: ${role.id} | Title: ${role.title}\n Salary: ${role.salary}\n`,
			);
		});
		
		startApp();
	});
}




