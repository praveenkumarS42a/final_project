import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';
import '../styles/AppointmentForm.css';  // Link to the CSS

const AppointmentForm = ({ doctorId, onSuccess }) => {
  const { post, loading, error } = useApi();
  const [dayOfWeek, setDayOfWeek] = useState(''); // Store day as string (e.g., 'Monday')
  const [timeSlot, setTimeSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  const handleDayOfWeekChange = async (e) => {
    const selectedDay = e.target.value;
    setDayOfWeek(selectedDay);

    // Convert day of week to a valid date (this part might depend on your back-end logic)
    const today = new Date();
    const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(selectedDay);
    if (dayIndex === -1) return; // Invalid day string

    // Get the date of the next occurrence of the selected day of the week
    const nextDay = new Date(today.setDate(today.getDate() + (dayIndex - today.getDay() + 7) % 7));
    const formattedDate = nextDay.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format

    try {
      const slots = await post(`/api/doctors/${doctorId}/available-slots`, { date: formattedDate });
      setAvailableSlots(slots);
    } catch (err) {
      // Error handling is managed by useApi hook
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const today = new Date();
      const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayOfWeek);
      const nextDay = new Date(today.setDate(today.getDate() + (dayIndex - today.getDay() + 7) % 7));
      const formattedDate = nextDay.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format

      await post('/api/appointments', {
        doctorId,
        date: formattedDate,
        timeSlot,
      });
      onSuccess();
    } catch (err) {
      // Error handling is managed by useApi hook
    }
  };

  return (
    <div className="form-container">
      <h2>Book an Appointment</h2>
      
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label>Day of the Week</label>
          <select
            value={dayOfWeek}
            onChange={handleDayOfWeekChange}
            required
          >
            <option value="">Select a day</option>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        {availableSlots.length > 0 && (
          <div>
            <label>Time Slot</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
            >
              <option value="">Select a time slot</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !dayOfWeek || !timeSlot}
        >
          {loading ? <div className="loading-spinner"></div> : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
