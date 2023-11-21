import React, { useState } from 'react';
import { FaHome, FaRegUserCircle } from "react-icons/fa";
import { LuSwords } from "react-icons/lu";


const SideBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 bg-gray-800 container mx-auto flex items-center justify-between p-4 z-10">
                {/* Hamburger Icon (left side) */}
                <div className='flex items-center'>
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
                    <div className='px-6'>
                        <a href='/' className='text-white hover:text-gray-400'>
                            <FaHome size={25} />
                        </a>
                    </div>

                    {/* Sword */}
                    <div className='px-6'>
                        <a href='/monster' className='text-white hover:text-gray-400'>
                            <LuSwords size={25} />
                        </a>
                    </div>
                </div>

                {/* User Authentication or Profile Section */}
                <div className='px-6'>
                    <a href='#' className='text-white hover:text-gray-400'>
                        <FaRegUserCircle size={30} />
                    </a>
                </div>
            </nav>


            <div className={`fixed top-16 left-0 h-full w-1/6 bg-gray-800 text-black menu-animation ${isMenuOpen ? 'slide-in' : 'slide-out'}`}>
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
        </>
    );
};

export default SideBar;