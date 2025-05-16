// src/routes/staff.js
const express               = require('express');
const { requireAuth }       = require('../middleware/auth');
const Employee              = require('../models/Employees');
const SalarySlip            = require('../models/SalarySlip');
const EmployeeHierarchy     = require('../models/EmployeeHierarchy');

const router = express.Router();

/**
 * POST /api/staff/create
 * Body: {
 *   // Employee
 *   name, phone, qualification, presentAddress, maritalStatus,
 *   nomineeName, emergencyContact,
 *   department, position, joiningDate, cnic, bankAccount,
 *   email, rt, salaryOffered, leaveEntitlement,
 *
 *   // SalarySlip
 *   month,
 *   basic, cola, houseRent, utility,
 *   performanceAllowance, overtime, leaveEncashment, otherAllowances,
 *   absenteeDeduction, fuelMaintenance, pfDeduction, otherDeductions,
 *   loanPrincipal, loanProfit, loanWithdrawal, loanBalance,
 *
 *   // Hierarchy
 *   seniorId?, juniorId?, relation?
 * }
 */
router.post('/create', requireAuth, async (req, res) => {
  const b = req.body;
  try {
    // 1) Create Employee
    const emp = await Employee.create({
      owner:           req.user._id,
      name:            b.name,
      phone:           b.phone,
      qualification:   b.qualification,
      presentAddress:  b.presentAddress,
      maritalStatus:   b.maritalStatus,
      nomineeName:     b.nomineeName,
      emergencyContact:b.emergencyContact,

      department:      b.department,
      position:        b.position,
      joiningDate:     b.joiningDate,
      cnic:            b.cnic,
      bankAccount:     b.bankAccount,

      email:           b.email,
      rt:              b.rt,
      salaryOffered:   b.salaryOffered,
      leaveEntitlement:b.leaveEntitlement,
    });

    // 2) Create SalarySlip
    const slip = await SalarySlip.create({
      employee:           emp._id,
      month:              b.month,

      basic:              b.basic,
      cola:               b.cola,
      houseRent:          b.houseRent,
      utility:            b.utility,
      performanceAllowance:b.performanceAllowance,
      overtime:           b.overtime,
      leaveEncashment:    b.leaveEncashment,
      otherAllowances:    b.otherAllowances,

      absenteeDeduction:  b.absenteeDeduction,
      fuelMaintenance:    b.fuelMaintenance,
      pfDeduction:        b.pfDeduction,
      otherDeductions:    b.otherDeductions,

      leaveEntitlement:   b.leaveEntitlement,

      loanPrincipal:      b.loanPrincipal,
      loanProfit:         b.loanProfit,
      loanWithdrawal:     b.loanWithdrawal,
      loanBalance:        b.loanBalance,
    });

    // 3) Create Hierarchy links
    const links = [];
    if (b.seniorId && b.relation) {
      links.push(EmployeeHierarchy.create({
        owner:    req.user._id,
        senior:   b.seniorId,
        junior:   emp._id,
        relation: b.relation,
      }));
    }
    if (b.juniorId && b.relation) {
      links.push(EmployeeHierarchy.create({
        owner:    req.user._id,
        senior:   emp._id,
        junior:   b.juniorId,
        relation: b.relation,
      }));
    }
    await Promise.all(links);

    // 4) Respond with everything
    res.json({
      status: 'success',
      data: {
        employee: emp,
        salarySlip: slip,
        hierarchyLinks: links.length,
      }
    });
  } catch (err) {
    console.error('Staff create error:', err);
    res.status(400).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
