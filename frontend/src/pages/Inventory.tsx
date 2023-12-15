import React from 'react';
import Image1 from '../assets/1.png';
import Image2 from '../assets/2.png';
import Image3 from '../assets/3.png';
import Image4 from '../assets/4.png';

import '../styles/Inventory.css';

const cardData = [
    { id: 1, imageUrl: Image1, description: 'Sabimaru' },
    { id: 2, imageUrl: Image2, description: 'Description 2' },
    { id: 3, imageUrl: Image3, description: 'Description 3' },
    { id: 4, imageUrl: Image4, description: 'Description 4' },
    { id: 5, imageUrl: Image1, description: 'Description 1' },
    { id: 6, imageUrl: Image2, description: 'Description 2' },
    { id: 7, imageUrl: Image3, description: 'Description 3' },
    { id: 8, imageUrl: Image4, description: 'Description 4' },
    { id: 9, imageUrl: Image1, description: 'Description 1' },
    { id: 10, imageUrl: Image2, description: 'Description 2' },
    { id: 11, imageUrl: Image3, description: 'Description 3' },
    { id: 12, imageUrl: Image4, description: 'Description 4' },
    { id: 13, imageUrl: Image1, description: 'Description 1' },
    { id: 14, imageUrl: Image2, description: 'Description 2' },
    { id: 15, imageUrl: Image3, description: 'Description 3' },
    { id: 16, imageUrl: Image4, description: 'Description 4' },
    // Add more items as needed
];

const Inventory = () => {
    return (
        <>
            <div>
                <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-8">Monster Collection</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-8 brightness-0 img-pixelated p-8 drop-shadow-xl">
                    {cardData.map((card) => (
                        <Card key={card.id} imageUrl={card.imageUrl} description={card.description} />
                    ))}
                </div>
            </div>
        </>
    );
};

const Card: React.FC<{ imageUrl: any; description: string }> = ({ imageUrl, description }) => {
    return (
        <div className="card-container">
            <div className="card-content">
                <img
                    src={imageUrl}
                    alt={description}
                    className="w-full object-cover mb-4 rounded-md card-image undrag-img"
                />
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );
};

export default Inventory;
