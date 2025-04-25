const express = require('express');
const { Faculty } = require('../models');
const fetchData = require('../utils/fetchData');

const router = express.Router();

// Route constants
const ROUTES = {
  FACULTIES: '/fetch-select-data/faculties',
};

router.get(ROUTES.FACULTIES, async (req, res) => {
  console.time('fetch_faculties_time');
  const memoryBefore = process.memoryUsage().heapUsed;
  const { status, body } = await fetchData(Faculty, ['faculty_id', 'name']);
  console.timeEnd('fetch_faculties_time');
  const memoryAfter = process.memoryUsage().heapUsed;
  console.log(`Memory Usage: Before: ${memoryBefore} After: ${memoryAfter}`);
  res.status(status).json(body);
});

module.exports = router;