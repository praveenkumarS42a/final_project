import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import './BookAppointment.css'; // Import CSS file

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState(''); // Store selected day of the week (e.g., "Monday")
  const [timeSlot, setTimeSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await api.get(`/api/doctors/${doctorId}`);
        setDoctor(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch doctor details');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleDayOfWeekChange = async (e) => {
    const selectedDay = e.target.value;
    setDayOfWeek(selectedDay);

    const today = new Date();
    const currentDayOfWeek = today.toLocaleString('en-us', { weekday: 'long' }); // Get current day of the week

    // Check if selected day matches the current day
    if (selectedDay === currentDayOfWeek) {
      try {
        const { data } = await api.get(`/api/doctors/${doctorId}/available-slots?date=${today.toISOString().split('T')[0]}`);
        setAvailableSlots(data.availableSlots);
      } catch (err) {
        setError('Failed to fetch available slots');
      }
    } else {
      setAvailableSlots([]); // Clear available slots if day doesn't match
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format

      await api.post('/api/appointments', { doctorId, date: formattedDate, timeSlot });
      navigate('/appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="appointment-container">
      <div className="appointment-box">
        <h1>Book Appointment with Dr. {doctor.user}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
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
            <div className="form-group">
              <label>Time Slot</label>
              <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required>
                <option value="">Select a time slot</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={!dayOfWeek}>
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
