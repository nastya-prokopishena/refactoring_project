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
  console.time('fetch_price_time');
  console.log('Memory Usage before request:', process.memoryUsage()); 

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
  } finally {
    console.log('Memory Usage after request:', process.memoryUsage()); 
    console.timeEnd('fetch_price_time');
  }
});

router.get(ROUTES.PRICES, async (req, res) => {
  console.time('fetch_prices_time');

  const { status, body } = await fetchData(Price, ['price_id', 'price_amount']);
  res.status(status).json(body);
  console.timeEnd('fetch_prices_time');

});

module.exports = router;