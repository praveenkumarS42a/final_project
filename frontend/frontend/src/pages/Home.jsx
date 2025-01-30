import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <>
      <nav className="navbar">
        <div className="logo">DocCare</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/doctors">Doctors</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/register" className="register-btn">Sign Up</Link></li>
        </ul>
      </nav>

      <div className="home-container">
        <div className="home-content">
          <h1 className="home-title">Welcome to Doctor Appointment System</h1>
          <p className="home-description">
            Book appointments with qualified doctors easily and manage your health efficiently.
          </p>
          <div className="button-group">
            <Link to="/doctors" className="btn btn-primary">Find Doctors</Link>
            <Link to="/register" className="btn btn-secondary">Register Now</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
