const express = require('express');
const { Faculty, Specialty } = require('../models');

const router = express.Router();

// Route constants
const ROUTES = {
  SPECIALTIES: '/fetch-select-data/specialties/:facultyId',
};

router.get(ROUTES.SPECIALTIES, async (req, res) => {
  const facultyId = req.params.facultyId;

  try {
    // Перевірка чи існує facultyId
    const faculty = await Faculty.findOne({
      where: { faculty_id: facultyId }
    });
    
    // Replace Error Code with Exception
    if (!faculty) {
      throw new Error(`Факультет з ID ${facultyId} не знайдено`);
    }

    // Якщо facultyId існує, витягуємо спеціальності
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
});

module.exports = router;