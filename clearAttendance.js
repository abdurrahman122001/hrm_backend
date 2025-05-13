// clearAttendance.js
require('dotenv').config()
const mongoose = require('mongoose')
const Attendance = require('./src/models/Attendance')  // adjust path if needed

async function clear() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('Connected to MongoDB')

  const result = await Attendance.deleteMany({})
  console.log(`Deleted ${result.deletedCount} attendance records`)

  await mongoose.disconnect()
  console.log('Disconnected')
}

clear().catch(err => {
  console.error(err)
  process.exit(1)
})
