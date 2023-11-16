import React, { useState } from 'react';

const ToDo = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-gray-800 text-white fixed top-0 left-0 w-full">
            <nav className="container mx-auto flex items-center justify-between p-4 z-10 relative">
                {/* Hamburger Icon (left side) */}
                <div className="hamburger">
                    <button
                        onClick={toggleMenu}
                        className={`bg-transparent text-white border-none focus:outline-none transition-all duration-300 ${
                            isMenuOpen ? 'rotate-180' : ''
                        }`}
                    >
                        {isMenuOpen ? (
                            // X Icon
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        ) : (
                            // Hamburger Icon
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        )}
                    </button>
                </div>

                {/* User Authentication or Profile Section */}
                <div className="hidden lg:flex items-center">
                    <div className="mr-4">Welcome, User!</div>
                    <button className="bg-transparent border border-white px-4 rounded">
                        Logout
                    </button>
                </div>
            </nav>

            {/* Responsive Hamburger Menu */}
            {isMenuOpen && (
                <div className="top-0 left-0 h-full w-1/4 bg-red-100 text-black">
                    <ul className="p-4">
                        <li className="p-2">Home</li>
                        <li className="p-2">Tasks</li>
                        <li className="p-2">About</li>
                        {/* Add more links as needed */}
                    </ul>
                </div>
            )}
        </header>
    );
};

export default ToDo;
