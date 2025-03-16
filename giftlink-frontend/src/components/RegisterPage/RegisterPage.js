/* jshint esversion: 8, moz: true */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
import { urlConfig } from '../../config';

const RegisterPage = () => {
    // Step 4: Include states for user input and error message
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState('');

    // Step 5: Create local variables for `navigate` and `setIsLoggedIn`
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    // Step 6: Implement `handleRegister` function
    const handleRegister = async () => {
        try {
            // Step 1: Call the backend API
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST', // Set method as POST
                headers: {
                    'Content-Type': 'application/json', // Set headers to accept JSON
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                }),
            });

            const json = await response.json(); // Step 1: Access data coming from the fetch API

            // Step 2: Set user details if registration is successful
            if (response.ok) {
                // Save the auth token and user info in session storage
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName); // Store the user's first name
                sessionStorage.setItem('email', json.email); // Store the user's email

                // Step 3: Set the state of the user to logged in using useAppContext
                setIsLoggedIn(true); // Update global state to logged in

                // Step 4: Navigate to the MainPage after logging in
                navigate('/app'); // Redirect to /app after successful registration
            } else {
                // Step 5: Set an error message if registration fails
                if (json.error) {
                    setShowerr(json.error); // Set error message from backend response
                }
            }

        } catch (e) {
            console.log("Error during registration: " + e.message);

            // Step 5: Set an error message if an unexpected error occurs
            setShowerr('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleRegister();
            }}>
                <div>
                    <label>First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div>
                    <label>Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Register</button>
            </form>

            {showerr && <div className="text-danger">{showerr}</div>} {/* Display error message if any */}
        </div>
    );
};

export default RegisterPage;
