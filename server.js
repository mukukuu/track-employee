const express = require('express');
const db = require('./db/connection');
const inquire = require('inquire');
require("console.table");




// const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));



// //default response for erequest errors
// app.use((req, res) => {
//     res.status(404).end();
// });

//start server after db connection
 db.connect(err => {
     if (err) throw err;
     console.log('Database connected')

//     app.listen(PORT, () => {
//     console.log(`API server now on mport ${PORT}`);
// });
 });


 //multiple choice question for user's action
const questions = async () => {

    await inquirer
    .prompt({
       name: 'actions',
       type: 'list',
       message: 'Menu',
       choices:[
           "view all department",
           "view all roles",
           "view all employees",
           "add a department",
           "add a role",
           "add an employee",
           "update an employee role",
       ],
   })
    .then((answer) => {
        switch (answer.action) {
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
    })
   };

questions();

