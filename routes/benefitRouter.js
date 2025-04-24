const express = require('express');
const { Benefit } = require('../models');
const fetchData = require('../utils/fetchData');

const router = express.Router();

const ROUTES = {
  BENEFITS: '/fetch-select-data/benefits',
};

router.get(ROUTES.BENEFITS, async (req, res) => {
  const { status, body } = await fetchData(Benefit, ['benefit_id', 'name']);
  res.status(status).json(body);
});

module.exports = router;