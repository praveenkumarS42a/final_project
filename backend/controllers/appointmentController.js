const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Get all appointments for a user (patient or doctor)
const getAppointments = async (req, res) => {
  try {
    let appointments;
    if (req.user.role === 'patient') {
      appointments = await Appointment.find({ patient: req.user._id })
        .populate('doctor', 'user specialization fees')
        .populate('patient', 'name email');
    } else {
      const doctor = await Doctor.findOne({ user: req.user._id });
      appointments = await Appointment.find({ doctor: doctor._id })
        .populate('doctor', 'user specialization fees')
        .populate('patient', 'name email');
    }
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.body;

    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date,
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create the appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      status: 'pending'
    });

    const populatedAppointment = await appointment.populate([
      { path: 'doctor', select: 'user specialization fees' },
      { path: 'patient', select: 'name email' }
    ]);

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify that the user has permission to update the appointment
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    appointment.status = status;
    await appointment.save();

    const updatedAppointment = await appointment.populate([
      { path: 'doctor', select: 'user specialization fees' },
      { path: 'patient', select: 'name email' }
    ]);

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify that the user has permission to cancel the appointment
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    const updatedAppointment = await appointment.populate([
      { path: 'doctor', select: 'user specialization fees' },
      { path: 'patient', select: 'name email' }
    ]);

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  cancelAppointment
};