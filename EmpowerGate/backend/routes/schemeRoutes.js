const express = require('express');
const router = express.Router();
const { getSchemes, checkEligibility } = require('../controllers/schemeController');

// Route 1: Get all schemes (GET /api/schemes)
router.get('/schemes', getSchemes);

// Route 2: Check Eligibility (POST /api/check-eligibility)
router.post('/check-eligibility', checkEligibility);

module.exports = router;