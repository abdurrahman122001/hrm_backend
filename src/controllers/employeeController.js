const Employee = require('../models/Employees');

// GET /api/employees
exports.getAllEmployees = async (req, res) => {
  try {
    const list = await Employee.find().sort({ name: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/employees
exports.createEmployee = async (req, res) => {
  try {
    const emp = new Employee(req.body);
    await emp.save();
    res.status(201).json(emp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
