const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Get all doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('user')
      .select('-__v');
      console.log(doctors);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user')
      .select('-__v');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create doctor profile
const createDoctorProfile = async (req, res) => {
  try {
    // Check if user is authorized to create a doctor profile
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Not authorized to create doctor profile' });
    }

    // Check if doctor profile already exists
    const existingProfile = await Doctor.findOne({ user: req.user._id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Doctor profile already exists' });
    }

    const { specialization, experience, fees, availableSlots } = req.body;

    const doctor = await Doctor.create({
      user: req.user._id,
      specialization,
      experience,
      fees,
      availableSlots
    });

    const populatedDoctor = await doctor.populate('user', 'name email');
    res.status(201).json(populatedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const { specialization, experience, fees, availableSlots } = req.body;

    doctor.specialization = specialization || doctor.specialization;
    doctor.experience = experience || doctor.experience;
    doctor.fees = fees || doctor.fees;
    doctor.availableSlots = availableSlots || doctor.availableSlots;

    await doctor.save();

    const updatedDoctor = await doctor.populate('user', 'name email');
    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available time slots for a doctor
const getAvailableSlots = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const { date } = req.query;
    // Get booked appointments for the specified date
    const bookedAppointments = await Appointment.find({
      doctor: doctor._id,
      date: new Date(date),
      status: { $ne: 'cancelled' }
    }).select('timeSlot');

    // Filter out booked slots from available slots
    const bookedSlots = bookedAppointments.map(app => app.timeSlot);
    const availableSlots = doctor.availableSlots
      .find(slot => slot.day === new Date(date).toLocaleDateString('en-US', { weekday: 'long' }))
      ?.times.filter(time => !bookedSlots.includes(time)) || [];

    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctorProfile,
  updateDoctorProfile,
  getAvailableSlots
};