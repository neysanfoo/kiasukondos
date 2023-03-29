import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const baseURL = process.env.REACT_APP_BACKEND_URL + "/api";

function Register() {
  const [registrationData, setRegistrationData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState(null);

  function handleChange(e) {
    setRegistrationData({ ...registrationData, [e.target.name]: e.target.value });
  };

  function handleSubmit(e) {
    e.preventDefault();

    axios.post(`${baseURL}/register/`, registrationData)
      .then((response) => {
        window.location.href = "/login";
      })
      .catch((error) => {
        setErrors(error.response.data);
        console.log(error.response.data)
      });
  };

  return (
    <div className="Register">
      <h1>Register</h1>
      {errors && Object.keys(errors).map((error, index) => (
        <p key={index} className="text-danger">{errors[error]}</p>
      ))
      }
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={handleChange}
            value={registrationData.username}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            value={registrationData.email}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            value={registrationData.password}
            required
          />
        </div>
        <button type="submit" className='btn btn-primary mt-4'>Register</button>
        <p className="mt-4">
          Already have an account? <Link to="/login" className="link">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
