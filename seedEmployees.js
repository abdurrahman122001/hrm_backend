 // seedEmployees.js
 require('dotenv').config();
 const mongoose = require('mongoose');
const Employee = require('./src/models/Employees');

 const employees = [
  { name: "Abdullah Ahmed",     position: "Software Engineer",  department: "Engineering",   email: "abdullahahmedqureshint@gmail.com" },
  { name: "Abdur Rahman",  position: "UX Designer",         department: "Design",        email: "qaziabdulrahmannt@gmail.com" },
  { name: "Michael Brown",  position: "Project Manager",     department: "Management",    email: "michael.brown@example.com" },
  { name: "Jessica Williams",position:"Data Analyst",       department: "Analytics",     email: "jessica.williams@example.com" },
  { name: "David Miller",   position: "Marketing Specialist",department: "Marketing",     email: "david.miller@example.com" },
  { name: "Emily Davis",    position: "HR Manager",         department: "Human Resources", email: "emily.davis@example.com" },
  { name: "Robert Wilson",  position: "Sales Representative",department: "Sales",         email: "robert.wilson@example.com" },
  { name: "Amanda Taylor",  position: "Content Writer",      department: "Marketing",     email: "amanda.taylor@example.com" },
 ];

 async function seed() {
   await mongoose.connect(process.env.MONGODB_URI);
   console.log('📦 Connected to MongoDB');

   await Employee.insertMany(employees, { ordered: false })
     .then(docs => console.log(`✅ Inserted ${docs.length} employees`))
     .catch(err => {
       if (err.code === 11000) {
         console.log('⚠️  Some employees already existed; skipped duplicates');
       } else {
         console.error(err);
       }
     });

   mongoose.disconnect();
 }

 seed();
