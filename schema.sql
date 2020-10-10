
-- Drops the employee_db if it already exists --
DROP DATABASE IF EXISTS employee_db;

-- Create the database employee_db and specified it for use.
CREATE DATABASE employee_db;

USE employee_db;

-- Create the table department.
CREATE TABLE department (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(30) NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE role (
	id int NOT NULL AUTO_INCREMENT,
    title varchar(30) NOT NULL,
	salary decimal,
	department_id int,
	PRIMARY KEY (id)
    );
CREATE TABLE employee (
	id int NOT NULL AUTO_INCREMENT,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    role_id int,
    manager_id int,
    PRIMARY KEY (id)
    );
    
    
    
    
