/* jshint esversion: 6, moz: true */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import DetailsPage from './components/DetailsPage/DetailsPage'; // Import the DetailsPage component
import Profile from './components/Profile/Profile'; // Import the Profile component
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import SearchPage from './components/SearchPage/SearchPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/app" element={<MainPage />} />
        <Route path="/app/login" element={<LoginPage />} />
        <Route path="/app/register" element={<RegisterPage />} />
        <Route path="/app/product/:productId" element={<DetailsPage />} />
        <Route path="/app/search" element={<SearchPage />} />
        
        {/* Add the Profile Route here */}
        <Route path="/app/profile" element={<Profile />} /> {/* Profile Component Route */}
      </Routes>
    </>
  );
}

export default App;
