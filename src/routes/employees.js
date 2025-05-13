// src/routes/employees.js
const router = require('express').Router();
const { getAllEmployees, createEmployee } = require('../controllers/employeeController');

router.get('/', getAllEmployees);
router.post('/', createEmployee);

module.exports = router;
