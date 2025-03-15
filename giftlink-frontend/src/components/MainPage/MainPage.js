import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { urlConfig } from "../config";  // Assuming the backend URL is defined in a config file.

const MainPage = () => {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    // Fetch all gifts
    const fetchGifts = async () => {
        try {
            let url = `${urlConfig.backendUrl}/api/gifts`; // URL to fetch gifts
            const response = await fetch(url);
            if (!response.ok) {
                // Something went wrong
                throw new Error(`HTTP error; ${response.status}`);
            }
            const data = await response.json();
            setGifts(data); // Setting gifts in the state
        } catch (error) {
            console.log('Fetch error: ' + error.message);
        }
    };

    useEffect(() => {
        fetchGifts();  // Call the function to fetch gifts when the component mounts
    }, []);

    // Format date
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);  // Convert seconds to milliseconds
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    // Navigate to the details page
    const handleNavigate = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container">
            <h2>Available Gifts</h2>
            <div className="row">
                {gifts.map(gift => (
                    <div key={gift.id} className="col-md-4">
                        <div className="card">
                            {/* Task 4: Display gift image or placeholder */}
                            <div className="image-placeholder">
                                {gift.image ? (
                                    <img src={gift.image} alt={gift.name} className="card-img-top" />
                                ) : (
                                    <div className="no-image-available">No Image Available</div>
                                )}
                            </div>
                            <div className="card-body">
                                {/* Task 5: Display gift name */}
                                <h5 className="card-title">{gift.name}</h5>
                                {/* Task 6: Display formatted date */}
                                <p className="card-text">{formatDate(gift.date_added)}</p>
                                {/* Button to navigate to the details page */}
                                <button className="btn btn-primary" onClick={() => handleNavigate(gift.id)}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainPage;
