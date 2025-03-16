import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useAppContext();

    const handleLogout = () => {
        sessionStorage.removeItem('authToken'); // Remove the JWT token from sessionStorage
        setIsLoggedIn(false); // Update global login status
        navigate('/login'); // Redirect to the login page
    };

    return (
        <nav>
            {isLoggedIn ? (
                <>
                    <span>Welcome, {sessionStorage.getItem('username')}</span>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/register')}>Register</button>
                </>
            )}
        </nav>
    );
};

export default Navbar;
