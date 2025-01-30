import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';  // Link to the CSS file

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="flex">
          <Link to="/" className="navbar-logo">
            Doctor Appointment
          </Link>
        </div>

        <div className="navbar-links">
          {user ? (
            <div className="flex items-center">
              <Link 
                to="/appointments" 
                className="navbar-link"
              >
                My Appointments
              </Link>
              <button
                onClick={logout}
                className="navbar-button logout-button"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <Link 
                to="/login"
                className="navbar-link"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="navbar-button register-button"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
