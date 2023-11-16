import React, { useState } from 'react';

const ToDo = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-white text-white fixed top-0 left-0 w-full">
            <nav className="bg-gray-800 container mx-auto flex items-center justify-between p-4 z-10 relative">
                {/* Hamburger Icon (left side) */}
                <div className="hamburger">
                    <button
                        onClick={toggleMenu}
                        className={`bg-transparent text-white border-none focus:outline-none transition-all duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
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
                
                {/* Home */}
                <div>

                </div>
                
                {/* Sword */}
                <div>
                    
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
            <div className={`min-h-screen top-0 left-0 h-full w-1/6 bg-gray-800 text-black menu-animation ${isMenuOpen ? 'slide-in' : 'slide-out'}`}>
                <img src='https://assets.pokemon.com/assets/cms2/img/pokedex/full/658_f2.png'></img>
                <div className="w-1/2 sm:w-1/8 lg:w-1/2 mx-auto border-t-2 border-white my-2 sm:mb-3 lg:mb-2"></div>
                <ul className="p-4">
                    <button className="my-5 p-2 block text-center text-white w-full bg-transparent border-2 border-white focus:outline-none hover:bg-white hover:text-black hover:border-cyan-300 transition-all duration-300">
                        Quest
                    </button>
                    <button className="my-5 p-2 block text-center text-white w-full bg-transparent border-2 border-white focus:outline-none hover:bg-white hover:text-black hover:border-cyan-300 transition-all duration-300">
                        Tasks
                    </button>
                    <button className="my-5 p-2 block text-center text-white w-full bg-transparent border-2 border-white focus:outline-none hover:bg-white hover:text-black hover:border-cyan-300 transition-all duration-300">
                        Achievement
                    </button>
                    {/* Add more buttons as needed */}
                </ul>
            </div>
        </header>
    );
};

export default ToDo;

