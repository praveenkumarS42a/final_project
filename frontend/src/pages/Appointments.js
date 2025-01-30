import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const timeSlots = [
  '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00',
  '11:00-11:30', '11:30-12:00', '14:00-14:30', '14:30-15:00',
  '15:00-15:30', '15:30-16:00', '16:00-16:30', '16:30-17:00'
];

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    doctor: '',
    appointmentDate: null,
    timeSlot: '',
    reason: '',
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('/api/appointments');
      setAppointments(res.data);
    } catch (err) {
      setError('Error fetching appointments');
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('/api/doctors');
      setDoctors(res.data);
    } catch (err) {
      setError('Error fetching doctors');
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      doctor: '',
      appointmentDate: null,
      timeSlot: '',
      reason: '',
    });
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, appointmentDate: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/appointments', {
        ...formData,
        appointmentDate: format(formData.appointmentDate, 'yyyy-MM-dd'),
      });
      setSuccess('Appointment scheduled successfully!');
      fetchAppointments();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error scheduling appointment');
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(`/api/appointments/${id}`, { status: 'cancelled' });
      setSuccess('Appointment cancelled successfully!');
      fetchAppointments();
    } catch (err) {
      setError('Error cancelling appointment');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Appointments</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Book New Appointment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {appointments.map((appointment) => (
          <Grid item xs={12} md={6} key={appointment._id}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {appointment.doctor.name}
              </Typography>
              <Typography color="textSecondary">
                Date: {format(new Date(appointment.appointmentDate), 'PP')}
              </Typography>
              <Typography color="textSecondary">
                Time: {appointment.timeSlot}
              </Typography>
              <Typography color="textSecondary">
                Status: {appointment.status}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Reason: {appointment.reason}
              </Typography>
              {appointment.status === 'scheduled' && (
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mt: 2, alignSelf: 'flex-start' }}
                  onClick={() => handleCancel(appointment._id)}
                >
                  Cancel Appointment
                </Button>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Book New Appointment</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              select
              fullWidth
              margin="normal"
              name="doctor"
              label="Select Doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </MenuItem>
              ))}
            </TextField>

            <DatePicker
              label="Appointment Date"
              value={formData.appointmentDate}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" required />
              )}
              minDate={new Date()}
            />

            <TextField
              select
              fullWidth
              margin="normal"
              name="timeSlot"
              label="Select Time Slot"
              value={formData.timeSlot}
              onChange={handleChange}
              required
            >
              {timeSlots.map((slot) => (
                <MenuItem key={slot} value={slot}>
                  {slot}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              name="reason"
              label="Reason for Visit"
              multiline
              rows={4}
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Book Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Appointments;
