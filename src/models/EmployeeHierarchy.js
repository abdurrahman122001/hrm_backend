const { Schema, model } = require('mongoose');

const EmployeeHierarchySchema = new Schema({
  owner:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senior:   { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  junior:   { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  relation: {
    type: String,
    enum: ['Manager','Team Lead','Mentor','Other'],
    default: 'Manager'
  }
}, {
  timestamps: true,
});

// ensure no duplicates per user
EmployeeHierarchySchema.index(
  { owner: 1, senior: 1, junior: 1 },
  { unique: true }
);

module.exports = model('EmployeeHierarchy', EmployeeHierarchySchema);
