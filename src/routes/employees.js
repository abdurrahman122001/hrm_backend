// src/routes/employees.js
const express            = require('express');
const { requireAuth }    = require('../middleware/auth');
const { list, create }   = require('../controllers/employeeController');

const router = express.Router();

router.get('/',    requireAuth, list);
router.post('/create', requireAuth, create);

module.exports = router;
