const { Schema, model } = require('mongoose');

const LeaveSchema = new Schema({
  owner:         { type: Schema.Types.ObjectId, ref: 'User', required: true },
  employee:      { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  startDate:     { type: Date, required: true },
  endDate:       { type: Date, required: true },
  daysRequested: { type: Number, required: true },
  type:          { type: String, enum: ['Paid','Unpaid'], required: true },
  status:        { type: String, enum: ['Pending','Approved','Rejected'], default: 'Pending' },
  requestedAt:   { type: Date, default: () => new Date() },
  approvedBy:    { type: Schema.Types.ObjectId, ref: 'User' },
  approvedAt:    { type: Date }
}, { timestamps: true });

// prevent overlapping for same employee
LeaveSchema.index({ employee: 1, startDate: 1, endDate: 1 }, { unique: true });

module.exports = model('Leave', LeaveSchema);
