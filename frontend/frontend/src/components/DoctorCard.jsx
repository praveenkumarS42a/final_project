import { Link } from 'react-router-dom';
import './DoctorCard.css';  // Link to the CSS

const DoctorCard = ({ doctor }) => {
  console.log(doctor)
  return (
    <div className="doctor-card">
      <h3 className="doctor-name">
        Dr. {doctor.user}
      </h3>
      <p className="specialization">{doctor.specialization}</p>
      <div className="doctor-details">
        <p>Experience: {doctor.experience} years</p>
        <p>Fees: ${doctor.fees}</p>
      </div>
      <Link
        to={`/doctors/${doctor._id}`}
        className="book-appointment-btn"
      >
        Book Appointment
      </Link>
    </div>
  );
};

export default DoctorCard;
