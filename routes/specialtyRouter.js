const express = require('express');
const { Faculty, Specialty } = require('../models');

const router = express.Router();

// Route constants
const ROUTES = {
  SPECIALTIES: '/fetch-select-data/specialties/:facultyId',
};

router.get(ROUTES.SPECIALTIES, async (req, res) => {
  const facultyId = req.params.facultyId;
  console.log('Memory Usage before request:', process.memoryUsage()); 
  console.time('fetch_specialties_time');

  try {
    const faculty = await Faculty.findOne({
      where: { faculty_id: facultyId }
    });
    
    
    if (!faculty) {
      throw new Error(`Факультет з ID ${facultyId} не знайдено`);
    }

    const specialties = await Specialty.findAll({
      where: { faculty_id: facultyId },
      attributes: ['specialty_id', 'name'] 
    });

    res.status(200).json(specialties);
  } catch (error) {
    if (error.message.includes('не знайдено')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
  }
  console.log('Memory Usage after request:', process.memoryUsage()); 
  console.timeEnd('fetch_specialties_time');

});

module.exports = router;