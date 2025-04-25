const express = require('express');
const { Benefit } = require('../models');
const fetchData = require('../utils/fetchData');

const router = express.Router();

const ROUTES = {
  BENEFITS: '/fetch-select-data/benefits',
};

router.get(ROUTES.BENEFITS, async (req, res) => {
  console.time('fetch_benefits_time');
  const beforeMemory = process.memoryUsage();
  const { status, body } = await fetchData(Benefit, ['benefit_id', 'name']);
  const afterMemory = process.memoryUsage();
  const memoryUsed = afterMemory.rss - beforeMemory.rss; 

  console.timeEnd('fetch_benefits_time');
  console.log(`Memory used: ${memoryUsed} bytes`);
   
  res.status(status).json(body);
});

module.exports = router;