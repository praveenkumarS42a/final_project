const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type:String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  fees: {
    type: Number,
    required: true
  },
  availableSlots: [{
    day: String,
    times: [String]
  }]
}, {
  timestamps: true
});

const Doctor = mongoose.model('doctor', doctorSchema);
module.exports = Doctor;