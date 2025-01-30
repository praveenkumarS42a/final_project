import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { post, loading, error } = useApi();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      await post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login');
    } catch (err) {
      // Error handling is managed by useApi hook
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Create Your Account</h2>

      <form className="register-form" onSubmit={handleSubmit}>
        {error && <div className="register-error">{error}</div>}

        <div>
          <label htmlFor="name" className="register-label">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="register-input"
          />
        </div>

        <div>
          <label htmlFor="email" className="register-label">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="register-input"
          />
        </div>

        <div>
          <label htmlFor="password" className="register-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="register-input"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="register-label">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="register-input"
          />
        </div>

        <button type="submit" disabled={loading} className="register-button">
          {loading ? <span className="loading-spinner"></span> : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
