const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor is required']
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Appointment date must be in the future'
    }
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
    enum: {
      values: [
        '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00',
        '11:00-11:30', '11:30-12:00', '14:00-14:30', '14:30-15:00',
        '15:00-15:30', '15:30-16:00', '16:00-16:30', '16:30-17:00'
      ],
      message: 'Invalid time slot selected'
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    minlength: [10, 'Reason must be at least 10 characters long'],
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent double booking
appointmentSchema.index({ doctor: 1, appointmentDate: 1, timeSlot: 1 }, { unique: true });

// Pre-save middleware to check for conflicts
appointmentSchema.pre('save', async function(next) {
  if (this.isModified('appointmentDate') || this.isModified('timeSlot')) {
    const existingAppointment = await this.constructor.findOne({
      doctor: this.doctor,
      appointmentDate: this.appointmentDate,
      timeSlot: this.timeSlot,
      _id: { $ne: this._id },
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      throw new Error('This time slot is already booked');
    }
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);