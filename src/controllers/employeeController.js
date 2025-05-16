// src/controllers/employeeController.js
const Employee = require('../models/Employees');

// GET /api/employees
exports.list = async (req, res) => {
  try {
    const emps = await Employee.find({ owner: req.user._id })
      .select('-owner')                    // hide owner field
      .sort({ name: 1 })
      .lean();
    res.json({ status: 'success', data: emps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /api/employees/create
exports.create = async (req, res) => {
  try {
    const body = req.body;
    const emp = await Employee.create({
      owner:           req.user._id,
      name:            body.name,
      phone:           body.phone,
      qualification:   body.qualification,
      presentAddress:  body.presentAddress,
      maritalStatus:   body.maritalStatus,
      nomineeName:     body.nomineeName,
      emergencyContact:body.emergencyContact,

      department:      body.department,
      position:        body.position,
      joiningDate:     body.joiningDate,
      cnic:            body.cnic,
      bankAccount:     body.bankAccount,

      email:           body.email,
      rt:              body.rt,
      salaryOffered:   body.salaryOffered,
      leaveEntitlement:body.leaveEntitlement,
    });
    res.json({ status: 'success', data: emp });
  } catch (err) {
    console.error(err);
    res.status(400).json({ status: 'error', message: err.message });
  }
};
