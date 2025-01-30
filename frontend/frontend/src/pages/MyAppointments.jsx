import { useState, useEffect } from 'react';
import api from '../utils/axios';
import './MyAppointments.css'; // Import the CSS file

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get('/api/appointments');
        setAppointments(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      await api.put(`/api/appointments/${id}/cancel`);
      setAppointments(appointments.map(app => 
        app._id === id ? { ...app, status: 'cancelled' } : app
      ));
    } catch (err) {
      setError('Failed to cancel appointment');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <h1 className="title">My Appointments</h1>
      <div className="appointments-list">
        {appointments.length === 0 ? (
          <p className="no-appointments">No appointments found.</p>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-info">
                <h2>Dr. {appointment.doctor.user.name}</h2>
                <p><strong>Specialization:</strong> {appointment.doctor.specialization}</p>
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appointment.timeSlot}</p>
                <p className={`status ${appointment.status}`}>Status: {appointment.status}</p>
              </div>
              {appointment.status === 'pending' && (
                <button className="cancel-button" onClick={() => handleCancel(appointment._id)}>
                  Cancel
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
