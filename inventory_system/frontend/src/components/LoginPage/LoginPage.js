import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; // Adjust the path to where AuthContext is located
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Access the login function from AuthContext
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      login(response.data.access); // Use the login function to update authentication state
      navigate('/product-list');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <div className="login">
            <h3>Login Here !</h3>
            <form onSubmit={handleSubmit}>
              <div className="login__field">
                <input
                  type="text"
                  className="login__input"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="login__field">
                <input
                  type="password"
                  className="login__input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login__submit">Login</button>
              {error && <p className="error">{error}</p>}
            </form>
          </div>
        </div>
        <div className="screen__background">
          <div className="screen__background__shape screen__background__shape1"></div>
          <div className="screen__background__shape screen__background__shape2"></div>
          <div className="screen__background__shape screen__background__shape3"></div>
          <div className="screen__background__shape screen__background__shape4"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
