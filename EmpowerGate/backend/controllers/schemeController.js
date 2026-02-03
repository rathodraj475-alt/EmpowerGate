const Scheme = require('../models/schemeModel');

// Get all schemes
const getSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check Eligibility
const checkEligibility = async (req, res) => {
  const { age, income, gender, caste, state, occupation } = req.body;

  try {
    const schemes = await Scheme.find();

    const eligibleSchemes = schemes.filter((scheme) => {
      const ageCheck = age >= scheme.eligibility.minAge && age <= scheme.eligibility.maxAge;
      const incomeCheck = scheme.eligibility.incomeLimit === 0 || income <= scheme.eligibility.incomeLimit;
      const genderCheck = scheme.eligibility.gender === "Any" || scheme.eligibility.gender === gender;
      const stateCheck = scheme.state === "All India" || scheme.state === state;
      const casteCheck = scheme.eligibility.caste.length === 0 || scheme.eligibility.caste.includes(caste);
      
      const occupationCheck = 
        scheme.category === "Citizens" || 
        scheme.category === "Women" || 
        scheme.category === "Seniors" || 
        scheme.category === occupation;

      return ageCheck && incomeCheck && genderCheck && stateCheck && casteCheck && occupationCheck;
    });

    res.json(eligibleSchemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSchemes, checkEligibility };