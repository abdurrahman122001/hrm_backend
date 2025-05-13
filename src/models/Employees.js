// src/models/Employee.js
const { Schema, model } = require('mongoose');

const EmployeeSchema = new Schema({
  name:       { type: String},
  position:   { type: String },
  department: { type: String },
  email:   { type: String, required: true, unique: true },
  rt:         { type: String, default: '15:15' },
}, { timestamps: true });

module.exports = model('Employee', EmployeeSchema);
