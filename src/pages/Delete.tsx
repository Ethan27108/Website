import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ImageData {
    id: number;
    url: string;
    description: string;
    username: string;
}

const Delete: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [images, setImages] = useState<ImageData[]>([]);
    const navigate = useNavigate();

    const ReturnPage = () => {
        navigate("/Home");
    }

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
    }, []);

    useEffect(() => {
        if (username) {
            fetchImages(username);
        }
    }, [username]);

    const fetchImages = async (user: string) => {
        const response = await fetch(`http://localhost:5000/GettingImage?username=${user}`);
        const data = await response.json();
        setImages(data.images);
    };

    const handleDelete = async (imageId: number) => {

        await fetch(`http://localhost:5000/deletePhoto`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageID: imageId }),
        });

        setImages(images.filter(image => image.id !== imageId));
    };

    // Log the images array before returning JSX
    console.log("Images array:", images);

    return (
        <div className="home-page">
            <div className="main-container">
                <div className="page-header">
                    <h1>🗑️ Manage Your Photos</h1>
                    <button onClick={ReturnPage} className="secondaryButton">
                        ← Back to Home
                    </button>
                </div>

                {username ? (
                    <div>
                        <h2>Your Photos ({images.length})</h2>
                        <div className="delete-grid">
                            {images.map(image => (
                                <div key={image.id} className="delete-item">
                                    <img src={image.url} alt={`Image ${image.id}`} />
                                    <div className="delete-item-content">
                                        <div style={{flex: 1}}>
                                            <p style={{marginBottom: '0.5rem'}}><strong>{image.description}</strong></p>
                                        </div>
                                        <button onClick={() => handleDelete(image.id)} className="dangerButton">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {images.length === 0 && (
                            <div style={{textAlign: 'center', padding: '2rem'}}>
                                <p>No photos to display</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', textAlign: 'center'}}>
                        <p>No user logged in.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Delete;