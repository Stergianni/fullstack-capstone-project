import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
import { urlConfig } from '../../config';  // Import the API URL configuration

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [incorrect, setIncorrect] = useState(''); // Task 4: State for incorrect password message
  const navigate = useNavigate();
  const bearerToken = sessionStorage.getItem('auth-token'); // Task 5: Get the bearer token from sessionStorage
  const { setIsLoggedIn } = useAppContext(); // Task 5: Set login state using context

  // Task 6: If the user is already logged in, navigate to the MainPage
  useEffect(() => {
    if (bearerToken) {
      navigate('/app');
    }
  }, [navigate, bearerToken]);

  const handleLogin = async () => {
    try {
      // Task 7: Set method, headers, and body for API call
      const response = await fetch(`${urlConfig.apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken ? `Bearer ${bearerToken}` : '', // Include bearer token if available
        },
        body: JSON.stringify({ email, password }), // Task 9: Send email and password in the request body
      });

      // Handle the response from the server
      const json = await response.json();

      // Check if login was successful
      if (response.ok) {
        // Task 2: Access data and set user details
        const { authtoken, userName, userEmail } = json;

        // Store token and user details in sessionStorage
        sessionStorage.setItem('auth-token', authtoken);
        sessionStorage.setItem('name', userName);
        sessionStorage.setItem('email', userEmail);

        // Task 3: Set the state of user to logged in using the useAppContext
        setIsLoggedIn(true);

        // Navigate to the MainPage after successful login
        navigate('/app');
      } else {
        // Handle error message if login fails (incorrect credentials)
        setIncorrect(json.error || 'Invalid login credentials');
      }
    } catch (e) {
      console.error('Error during login:', e.message);
      setIncorrect('An error occurred while logging in. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>

      {incorrect && <div className="text-danger">{incorrect}</div>} {/* Show error message if login fails */}
    </div>
  );
};

export default LoginPage;
