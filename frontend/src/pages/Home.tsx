import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tokenAuth from '../utils/tokenAuth.ts';

const Home = () => {
	const [loaded, setLoaded] = useState(false);
	const [showWelcome, setShowWelcome] = useState(false);
	const navigate = useNavigate();
  
	useEffect(() => {
		if (loaded) {
			return;
		}
		tokenAuth(navigate);
		setLoaded(true);
	});
  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-900 text-white py-3 px-3 sm:px-6 lg:px-12 flex flex-wrap justify-between lg:justify-around items-center fixed top-0 left-0 w-full z-10">
        <div className="text-xl w-1/2 sm:text-2xl sm:w-1/2 lg:w-auto lg:text-3xl font-bold">
          <a href="/" style={{ color: 'white' }}>Habitkub</a>
        </div>
        <div className="w-1/2 sm:w-1/2 lg:w-auto flex justify-center items-center mt-0 sm:mt-0">
          <button className="bg-gray-900 border-2 border-gray-500 mr-2 sm:mr-3 text-white text-sm sm:text-base"> {/* Adjust button size on small screens */}
            <a href='/Sign_up' style={{ color: 'white' }}>Sign Up</a>
          </button>
          <button className="bg-gray-900 border-2 border-gray-500 text-white text-sm sm:text-base"> {/* Adjust button size on small screens */}
            <a href='/Log_in' style={{ color: 'white' }}>Log in</a>
          </button>
        </div>
      </nav>


      <div className="bg-black top-0 left-0 sm:w-full z-5 flex flex-col items-center justify-center">
        <div className={`min-h-screen flex-1 flex flex-col items-center justify-center transform transition-transform duration-700 ${showWelcome ? 'welcome-animation' : ''}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white text-center">WELCOME HONOURED GUEST</h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-white text-center mt-4 sm:mt-3 lg:mt-5 lg:mb-2"> {/* Adjust text size on small screens */}
            to the birthplace of our dynasty
          </p>
          <button className="bg-black border-2 border-gray-500 shadow-sm shadow-white text-white px-5 py-3 rounded-md mt-3 sm:mt-4 hover-bg-gray-900 transform hover:scale-105 transition-transform text-sm sm:text-base"> {/* Adjust button size and text size on small screens */}
            Get Started
          </button>
        </div>



        <div className="min-h-screen p-4 sm:p-8 lg:p-12 text-center">
          <h2 className="text-3xl font-bold text-white p-3 sm:p-6">Our App's Purpose</h2>
          <div className="flex flex-col lg:flex-row lg:justify-between">
            {/* Purpose 1 */}
            <div className="p-3 sm:p-6 lg:p-8 container lg:flex-1">
              <div className="rounded-lg border-2 border-white p-3 sm:p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white">1. Track Your Habits and Goals</h2>
                <p className="text-md text-white mt-2 sm:mt-3">
                  Stay accountable by tracking and managing your Habits, Daily goals, and To-Do list with our web app.
                </p>
              </div>
            </div>

            {/* Purpose 2 */}
            <div className="p-3 sm:p-6 lg:p-8 container lg:flex-1">
              <div className="rounded-lg border-2 border-white p-3 sm:p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white">2. Earn Rewards for Your Goals</h2>
                <p className="text-md text-white mt-2 sm:mt-3">
                  Check off tasks to gain rewards and use them to tame mysterious creatures in Habitkub.
                </p>
              </div>
            </div>

            {/* Purpose 3 */}
            <div className="p-3 sm:p-6 lg:p-8 container lg:flex-1">
              <div className="rounded-lg border-2 border-white p-3 sm:p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white">3. Tame Mysterious Monsters</h2>
                <p className="text-md text-white mt-2 sm:mt-3">
                  Tame monsters with the item you got from tasks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-3 sm:py-6 lg:py-2">
        <div className="container mx-auto p-3 sm:p-6 lg:p-12 flex flex-wrap lg:flex-nowrap justify-between">
          <div className="mb-2 sm:mb-4 items-center">
            <h2 className="text-2xl font-bold">Habitkub</h2>
          </div>
          <div className="w-full sm:w-1/2 lg:w-auto sm:mr-0 lg:mr-6 mt-2 sm:mt-0">
            <h2 className="text-2xl font-bold">Company</h2>
            <ul className="mt-2 sm:mt-3">
              <li>
                <a href="#" className="text-white hover:text-gray-400">About Us</a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-400">Our Team</a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-400">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-1/2 lg:w-auto">
            <h2 className="text-2xl font-bold">Resources</h2>
            <ul className="mt-2 sm:mt-3">
              <li>
                <a href="#" className="text-white hover:text-gray-400">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-400">Terms and Conditions</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-md mt-2 sm:mt-4 lg:mt-2">
          <div className="w-full sm:w-1/4 lg:w-1/2 border-t-2 border-gray-600 mb-2 sm:mb-3 lg:mb-2"></div>
          <p>&copy; 2023 Habitkub. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Home;
