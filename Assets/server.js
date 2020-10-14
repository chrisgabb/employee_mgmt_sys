var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleT = require("console.table")

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "DBZD2018!",
    database: "employee_db"
});


connection.connect(function (err) {
    if (err) throw err;
    runSearch()
});

// function allEmp() {
//     connection.query(`SELECT employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.id, role.title
//                     FROM role
//                     LEFT JOIN employee ON role.id = employee.role_id`, function (err, res) {
//         if (err) throw err;
//         console.log(consoleT.getTable(res))

//         })
//     }


function runSearch() {

    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Add department",
                "Add roles",
                "Add employees",
                "View department",
                "View roles",
                "View employees",
                "Update employee roles by employee id",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add department":
                    addDept();
                    break;

                case "Add roles":
                    addRoles();
                    break;

                case "Add employees":
                    addEmployees();
                    break;

                case "View department":
                    viewDept();
                    break;

                case "View roles":
                    viewRoles();
                    break;

                case "View employees":
                    viewEmployees();
                    break;

                case "Update employee roles by employee id":
                    updateEmployeeRole();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}


function addDept() {
    inquirer
        .prompt({
            name: "dept_name",
            type: "input",
            message: "What is the name of the department you are adding?"
        })
        .then(function (answer) {
            var query = "INSERT INTO department SET ?";
            connection.query(query, { name: answer.dept_name }, function (err, res) {
                if (err) {
                    return console.error(err.message)
                }
                console.log("Added Department: " + answer.dept_name);
                runSearch();
            });
        });
}

function addRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
            console.log(consoleT.getTable(res))
    inquirer
        .prompt([
            {
                name: "role_title",
                type: "input",
                message: "What is the title of the role?"
            },
            {
                name: "role_salary",
                type: "input",
                message: "What is the salary of this role?"
            },
            {
                name: "role_dept_id",
                type: "input",
                message: "What is the department ID for this role?"
            }])
        .then(function (answer) {
            var query = "INSERT INTO role SET ?";
            connection.query(query, { title: answer.role_title, salary: answer.role_salary, department_id: answer.role_dept_id }, function (err, res) {
                if (err) {
                    return console.error(err.message)
                }
                console.log("Added Role... Title: " + answer.role_title + "|| Salary: " + answer.role_salary + "|| Dept ID: " + answer.role_dept_id);
                runSearch();
            });
        });
    })
}

function addEmployees() {
    connection.query(`SELECT role.id, role.title, employee.first_name, employee.last_name, employee.role_id, employee.manager_id 
                    FROM role
                    LEFT JOIN employee ON role.id = employee.role_id`, function (err, res) {
        if (err) throw err;
    inquirer
        .prompt([
            {
                name: "first_name",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "last_name",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name: "role",
                type: "list",
                message: "Select the employee's role",
                choices: function () {
                  var roleArray = [];
                  for (let i = 0; i < res.length; i++) {
                    roleArray.push(res[i].id + " " + res[i].title)
                  }
                  return roleArray
                }
              },
              {
                name: "manager",
                type: "list",
                message: "Select the employee's manager",
                choices: function () {
                  var depArray = [];
                  for (let i = 0; i < res.length; i++) {
                      if (res[i].manager_id !== null) {
                    depArray.push(res[i].first_name + " " + res[i].last_name)
                  }
                }
                  return depArray
                }
              }])
        .then(function (answer) {
            var query = "INSERT INTO employee SET ?";
            connection.query(query, { first_name: answer.first_name, last_name: answer.last_name, role_id: answer.role, manager_id: answer.manager }, function (err, res) {
                if (err) {
                    return console.error(err.message)
                }
                console.log("Added Employee... First Name: " + answer.first_name + "|| Last Name: " + answer.last_name + "|| Role ID: " + answer.role_id + "|| Manager ID: " + answer.mgr_id);
                runSearch();
            });
        });
    })
}

function viewDept() {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) {
            return console.error(err.message)
        } else {
            for (var i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].id + "|| Name: " + res[i].name);
            }
        }
        runSearch();
    });

}

function viewRoles() {
    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) {
            return console.error(err.message)
        } else {
            for (var i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].id + "|| Title: " + res[i].title + "|| Salary: " + res[i].salary + "|| Department ID: " + res[i].department_id);
            }
        }
        runSearch();
    });

}

function viewEmployees() {
    var query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        if (err) {
            return console.error(err.message)
        } else {
            for (var i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].id + "|| First Name " + res[i].first_name + "|| Last Name: " + res[i].last_name + "|| Role ID: " + res[i].role_id + "|| Manager ID: " + res[i].manager_id);
            }
        }
        runSearch();
    });

}

function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                name: "employee_select",
                type: "input",
                message: "What is the ID of the Employee who's role will be updated?"
            },
            {
                name: "role_new",
                type: "input",
                message: "What should their new role be set to?"
            }])
        .then(function (answer) {
            var query = "UPDATE employee SET role_id = ? WHERE id = ?";
            connection.query(query, [answer.role_new, answer.employee_select], function (err, res) {
                    console.log("ID: " + res[i].id + "|| First Name " + res[i].first_name + "|| Last Name: " + res[i].last_name + "|| Role ID: " + res[i].role_id + "|| Manager ID: " + res[i].manager_id);

            })
            runSearch();
        });

}
