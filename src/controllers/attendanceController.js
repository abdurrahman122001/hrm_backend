// src/controllers/attendanceCtrl.js
const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');
 const { backfillForDate } = require('../backfillAttendance');

// POST /api/attendance
exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, checkIn, checkOut, notes } = req.body;
    const payload = {
      employee: employeeId,
      date,
      status,
      checkIn,
      checkOut,
      notes
    };
    const rec = await Attendance.findOneAndUpdate(
      { employee: employeeId, date },
      payload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(rec);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/attendance?date=YYYY-MM-DD
exports.getRecordsByDate = async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'date query parameter is required' });
  }
  try {
    // On-demand backfill: add any missing “Pending” rows
    const count = await backfillForDate(date);
    if (count) {
      console.log(`🔄 Backfilled ${count} pending records for ${date}`);
    }

    // Now fetch and return
    const records = await Attendance.find({ date })
      .populate('employee', 'name position department email')
      .lean();
    res.json(records);
  } catch (err) {
    console.error('Error in getRecordsByDate:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/attendance/stats?date=YYYY-MM-DD
exports.getStats = async (req, res) => {
  try {
    const { date } = req.query;
    const stats = await Attendance.aggregate([
      { $match: { date } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const result = { present: 0, late: 0, absent: 0, halfDay: 0, total: 0 };
    stats.forEach(({ _id, count }) => {
      const key =
        _id === 'Half Day'
          ? 'halfDay'
          : _id.toLowerCase();
      result[key] = count;
      result.total += count;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/attendance/employee/:id
exports.getRecordsByEmployee = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid employee ID' });
  }
  try {
    const records = await Attendance
      .find({ employee: id })
      .sort('date')
      .populate('employee', 'name position department');
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getStatsByEmployee = async (req, res) => {
  const { id } = req.params;
  const { from, to } = req.query;               // ← grab from/to instead of month

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid employee ID' });
  }

  try {
    // Build the match
    const match = { employee: new mongoose.Types.ObjectId(id) };

    // If both from+to are provided, add a $gte/$lte filter:
    if (from && to) {
      match.date = {
        $gte: from,     
        $lte: to        
      };
    }

    const stats = await Attendance.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const result = { present: 0, late: 0, halfDay: 0, absent: 0, total: 0 };
    stats.forEach(({ _id, count }) => {
      const key = _id === "Half Day" ? "halfDay" : _id.toLowerCase();
      result[key] = count;
      result.total += count;
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};