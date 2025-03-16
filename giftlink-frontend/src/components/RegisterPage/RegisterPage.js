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
            // Step 7: Set POST method
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST', // Set the method to POST
                headers: {
                    'Content-Type': 'application/json', // Set the headers to accept JSON
                },
                // Step 8: Set the body to send user details
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json(); // Parse the response to JSON

            // Check if the registration was successful
            if (response.ok) {
                // Step 9: Save the JWT token to sessionStorage
                sessionStorage.setItem('authToken', data.authtoken);

                // Update the global logged-in status
                setIsLoggedIn(true);

                // Step 10: Redirect to the app's main page after successful registration
                navigate('/app'); // Redirect to /app
            } else {
                // If registration fails, show error message
                setShowerr(data.error || 'Registration failed, please try again.');
            }
        } catch (e) {
            console.log("Error during registration: " + e.message);
            setShowerr('An error occurred while registering, please try again.');
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

            {showerr && <p style={{ color: 'red' }}>{showerr}</p>} {/* Display error message if any */}
        </div>
    );
};

export default RegisterPage;
