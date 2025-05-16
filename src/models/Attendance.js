const { Schema, model } = require('mongoose');

const AttendanceSchema = new Schema({
  owner:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  employee:   { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  date:       { type: Date, required: true },
  status:     { type: String, enum: ['Present','Late','Absent','Half Day'], required: true },
  leaveType:  { type: String, enum: ['Paid','Unpaid'], default: null },
  checkIn:    { type: String },
  checkOut:   { type: String },
  notes:      { type: String },
  markedByHR: { type: Boolean, default: true },
}, {
  timestamps: true,
  toJSON:    { virtuals: true },
  toObject:  { virtuals: true },
});

// unique per user + employee + date
AttendanceSchema.index(
  { owner: 1, employee: 1, date: 1 },
  { unique: true }
);

module.exports = model('Attendance', AttendanceSchema);
