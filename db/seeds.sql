INSERT INTO department (title)
VALUES 
("Mission"),
("Kitchen");

INSERT INTO roles (title, salary, department_id)
VALUE 
("farmer", 90000.00, 2),
("fisher", 60000.00, 3),
("hunter", 700000.00, 4),
("chief", 800000.00, 1),
("butcher", 500000.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE 
("Johny", "John", 1, 3),
("Tony", "Ton", 1, 1),
("Sammy", "Sam", 3, 2),
("Any", "Ann", 5, 2),
("Bobyr", "Bob", 5, 2);