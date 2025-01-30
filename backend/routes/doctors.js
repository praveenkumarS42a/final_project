const express = require('express');
const router = express.Router();
const { 
  getDoctors, 
  getDoctorById, 
  createDoctorProfile, 
  updateDoctorProfile,
  getAvailableSlots 
} = require('../controllers/doctorController');
const { protect } = require('../middleware/in');

// Public routes
// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', getDoctors);
// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get('/:id', getDoctorById);
// @route   GET /api/doctors/:id/available-slots
// @desc    Get available slots for a doctor
// @access  Public
router.get('/:id/available-slots', getAvailableSlots);
// Protected routes - require authentication
router.use(protect);
// @route   POST /api/doctors
// @desc    Create doctor profile
// @access  Private (Doctor only)
router.post('/', createDoctorProfile);
// @route   PUT /api/doctors/profile
// @desc    Update doctor profile
// @access  Private (Doctor only)
router.put('/profile', updateDoctorProfile);
module.exports = router;