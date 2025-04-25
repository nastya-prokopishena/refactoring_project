const express = require('express');
const { Dormitories } = require('../models');

const router = express.Router();

const ROUTES = {
  DORMITORIES: '/fetch-select-data/dormitories/:dormitoryId',
};

router.get(ROUTES.DORMITORIES, async (req, res) => {
  const dormitoryId = req.params.dormitoryId;
  console.time('fetch_dormitories_time');
  console.log('Memory Usage:', process.memoryUsage());
  try {
    const dormitoryData = await Dormitories.findOne({
      where: { dormitory_id: dormitoryId },
      attributes: ['address', 'phone_number', 'type_residents', 'price_id']
    });

    if (!dormitoryData) {
      throw new Error(`Гуртожиток з ID ${dormitoryId} не знайдено`);
    }

    res.json(dormitoryData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  console.timeEnd('fetch_dormitories_time'); 
  console.log('Memory Usage after response:', process.memoryUsage());
});

module.exports = router;