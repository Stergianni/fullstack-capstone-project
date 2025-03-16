/* jshint esversion: 8, moz: true */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';  // Assuming you have this context set up

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [incorrect, setIncorrect] = useState('');
  const navigate = useNavigate();
  const bearerToken = sessionStorage.getItem('auth-token');
  const { setIsLoggedIn } = useAppContext();

  // If already logged in, redirect to the main page
  useEffect(() => {
    if (bearerToken) {
      navigate('/app');
    }
  }, [bearerToken, navigate]);

  const handleLogin = async () => {
    try {
      const res = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const json = await res.json();  // Step 1: Access data from backend

      if (json.authtoken) {
        // Step 2: Set user details in session storage
        sessionStorage.setItem('auth-token', json.authtoken);
        sessionStorage.setItem('name', json.userName);
        sessionStorage.setItem('email', json.userEmail);

        // Step 3: Set the user's state to logged in
        setIsLoggedIn(true);

        // Step 4: Navigate to MainPage
        navigate('/app');
      } else {
        // Step 5: Clear input and set error message
        setEmail('');
        setPassword('');
        setIncorrect("Wrong password. Try again.");

        // Step 6: Clear error message after 2 seconds
        setTimeout(() => {
          setIncorrect("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error fetching details: " + error.message);
      setIncorrect("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleLogin}>Login</button>
      </form>

      {/* Display error message if incorrect password */}
      <span style={{color: 'red', height: '.5cm', display: 'block', fontStyle: 'italic', fontSize: '12px'}}>
        {incorrect}
      </span>
    </div>
  );
};

export default LoginPage;
