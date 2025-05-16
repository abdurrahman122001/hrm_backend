// src/controllers/salarySlipController.js
const SalarySlip = require('../models/SalarySlip');

exports.create = async (req, res) => {
  try {
    const b = req.body;
    const slip = await SalarySlip.create({
      employee:           b.employeeId,
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
    res.json({ status: 'success', data: slip });
  } catch (err) {
    console.error(err);
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.getByEmployeeAndMonth = async (req, res) => {
  try {
    const { employeeId, month } = req.params;
    const slip = await SalarySlip.findOne({ employee: employeeId, month }).lean();
    if (!slip) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }
    res.json({ status: 'success', data: slip });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};
