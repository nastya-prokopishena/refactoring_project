const express = require('express');
const { Price } = require('../models');
const fetchData = require('../utils/fetchData');

const router = express.Router();

const ROUTES = {
  PRICE: '/fetch-select-data/price/:priceId',
  PRICES: '/prices',
};

router.get(ROUTES.PRICE, async (req, res) => {
  const priceId = req.params.priceId;

  try {
    const priceData = await Price.findOne({
      where: { price_id: priceId },
      attributes: ['price_amount']
    });

    if (!priceData) {
      throw new Error(`Ціна з ID ${priceId} не знайдена`);
    }

    res.json(priceData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(ROUTES.PRICES, async (req, res) => {
  const { status, body } = await fetchData(Price, ['price_id', 'price_amount']);
  res.status(status).json(body);
});

module.exports = router;