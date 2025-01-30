const express = require('express');
const router = express.Router();
const { 
  getAppointments, 
  createAppointment, 
  updateAppointmentStatus, 
  cancelAppointment 
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/in');

// All routes are protected and require authentication
router.use(protect);

// @route   GET /api/appointments
// @desc    Get all appointments for the logged-in user
// @access  Private
router.get('/', getAppointments);

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private (Patient only)
router.post('/', createAppointment);

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private (Doctor only)
router.put('/:id/status', updateAppointmentStatus);

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel appointment
// @access  Private (Patient only)
router.put('/:id/cancel', cancelAppointment);

module.exports = router;