import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import urlConfig from '../config/urlConfig';
import { urlConfig } from '../../config';


const MainPage = () => {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGifts();
    }, []);

    const fetchGifts = async () => {
        try {
            let url = `${urlConfig.backendUrl}/api/gifts`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const data = await response.json();
            setGifts(data);
        } catch (error) {
            console.log('Fetch error:', error.message);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="container mt-4">
            <h2>Gift List</h2>
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-4">
                        <div className="card mb-4">
                            <div className="image-placeholder">
                                {gift.image ? (
                                    <img src={gift.image} alt={gift.name} className="card-img-top" />
                                ) : (
                                    <div className="no-image-available">No Image Available</div>
                                )}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{gift.name}</h5>
                                <p className="card-text">{formatDate(gift.date_added)}</p>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={() => navigate(`/app/product/${gift.id}`)}
                                >
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
