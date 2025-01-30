import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import './DoctorDetail.css'; // Import the CSS file

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await api.get(`/api/doctors/${id}`);
        setDoctor(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch doctor details');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <div className="doctor-card">
        <h1 className="doctor-name">Dr. {doctor.user}</h1>
        <div className="doctor-info">
          <p><span>Specialization:</span> {doctor.specialization}</p>
          <p><span>Experience:</span> {doctor.experience} years</p>
          <p><span>Fees:</span> ${doctor.fees}</p>
        </div>
        <button className="book-button" onClick={() => navigate(`/book-appointment/${doctor._id}`)}>
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorDetail;
