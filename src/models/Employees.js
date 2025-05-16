// src/models/Employee.js
const { Schema, model } = require('mongoose');

const EmployeeSchema = new Schema({
  owner:           { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name:            { type: String, required: true },
  phone:           { type: String },
  qualification:   { type: String },
  presentAddress:  { type: String },
  maritalStatus:   { type: String, enum: ['Single','Married'] },
  nomineeName:     { type: String },
  emergencyContact:{ type: String },

  department:      { type: String },
  position:        { type: String },
  joiningDate:     { type: Date },
  cnic:            { type: String },
  bankAccount:     { type: String },

  email:           { type: String, required: true, unique: true },
  rt:              { type: String, default: '09:00' },   // Reporting Time
  salaryOffered:   { type: Number, default: 0 },
  leaveEntitlement:{
    total:         { type: Number, default: 22 },
    paid:          { type: Number, default: 22 },
    unpaid:        { type: Number, default: 0 },
  },
}, { timestamps: true });

module.exports = model('Employee', EmployeeSchema);
