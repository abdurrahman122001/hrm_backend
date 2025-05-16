// src/models/SalarySlip.js
const { Schema, model } = require('mongoose');

const SalarySlipSchema = new Schema({
  employee:       { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  month:          { type: String, required: true },   // e.g. "February 2025"
  generatedOn:    { type: Date, default: Date.now },

  // — Allowances —
  basic:               { type: Number, default: 0 },
  cola:                { type: Number, default: 0 },
  houseRent:           { type: Number, default: 0 },
  utility:             { type: Number, default: 0 },
  performanceAllowance:{ type: Number, default: 0 },
  overtime:            { type: Number, default: 0 },
  leaveEncashment:     { type: Number, default: 0 },
  otherAllowances:     { type: Number, default: 0 },

  totalAllowances:     { type: Number, default: 0 },

  // — Deductions —
  absenteeDeduction:   { type: Number, default: 0 },
  fuelMaintenance:     { type: Number, default: 0 },
  pfDeduction:         { type: Number, default: 0 },
  otherDeductions:     { type: Number, default: 0 },

  totalDeductions:     { type: Number, default: 0 },

  // — Net Pay —
  netPayable:          { type: Number, default: 0 },

  // — Single leave entitlement field (no breakdown) —
  leaveEntitlement:    { type: Number, required: true },

  // — Loan details (if you still need them) —
  loanPrincipal:       { type: Number, default: 0 },
  loanProfit:          { type: Number, default: 0 },
  loanWithdrawal:      { type: Number, default: 0 },
  loanBalance:         { type: Number, default: 0 },

}, { timestamps: true });

// Recompute totals on save
SalarySlipSchema.pre('save', function(next) {
  this.totalAllowances = [
    this.basic, this.cola, this.houseRent, this.utility,
    this.performanceAllowance, this.overtime,
    this.leaveEncashment, this.otherAllowances
  ].reduce((a, b) => a + b, 0);

  this.totalDeductions = [
    this.absenteeDeduction, this.fuelMaintenance,
    this.pfDeduction, this.otherDeductions
  ].reduce((a, b) => a + b, 0);

  this.netPayable = this.totalAllowances - this.totalDeductions;
  next();
});

module.exports = model('SalarySlip', SalarySlipSchema);
