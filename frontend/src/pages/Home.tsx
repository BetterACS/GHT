import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tokenAuth from '../utils/tokenAuth.ts';

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowWelcome(true);
    if (loaded) {
      return;
    }
    tokenAuth(navigate);
    setLoaded(true);
  });
  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-900 text-white flex flex-wrap justify-between items-center fixed top-0 left-0 py-3 px-3 w-full z-10 sm:px-6 lg:px-12 lg:justify-around">
        <div className="text-xl w-1/2 font-bold sm:text-2xl sm:w-1/2 lg:w-auto lg:text-3xl ">
          <a href="/" style={{ color: 'white' }}>Habitkub</a>
        </div>
        <div className="flex justify-center items-center mt-0 w-1/2 sm:mt-0 sm:w-1/2 lg:w-auto">
          <button className="bg-gray-900 border-2 border-gray-500 mr-2 text-white text-sm sm:mr-3 sm:text-base">
            <a href='/Sign_up' style={{ color: 'white' }}>Sign Up</a>
          </button>
          <button className="bg-gray-900 border-2 border-gray-500 text-white text-sm sm:text-base">
            <a href='/Log_in' style={{ color: 'white' }}>Log in</a>
          </button>
        </div>
      </nav>


      <div className="bg-black top-0 left-0 z-5 flex flex-col items-center justify-center sm:w-full">
        <div className={`min-h-screen flex-1 flex flex-col items-center justify-center transform transition-transform duration-700 ${showWelcome ? 'welcome-animation' : ''}`}>
          <h2 className="text-3xl font-bold text-white text-center sm:text-4xl lg:text-6xl">WELCOME HONOURED GUEST</h2>
          <p className="text-lg text-white text-center mt-4 sm:mt-3 sm:text-xl lg:text-2xl lg:mt-5 lg:mb-2">
            to the birthplace of our dynasty
          </p>
          <button className="bg-black border-2 border-gray-500 text-white px-5 py-3 rounded-md mt-3 hover-bg-gray-900 transform hover:scale-105 transition-transform text-sm sm:text-base sm:mt-4">
            Get Started
          </button>
        </div>



        <div className="min-h-screen p-4 text-center sm:p-8 lg:p-12">
          <h2 className="font-bold text-3xl text-white p-3 sm:p-6">Our App's Purpose</h2>
          <div className="flex flex-col lg:flex-row lg:justify-between">
            {/* Purpose 1 */}
            <div className="container p-3 sm:p-6 lg:p-8 lg:flex">
              <div className="rounded-lg border-2 border-white p-3 sm:p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white">1. Track Your Habits and Goals</h2>
                <p className="text-md text-white mt-2 sm:mt-3">
                  Stay accountable by tracking and managing your Habits, Daily goals, and To-Do list with our web app.
                </p>
              </div>
            </div>

            {/* Purpose 2 */}
            <div className="container p-3 sm:p-6 lg:p-8 lg:flex">
              <div className="rounded-lg border-2 border-white p-3 sm:p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-white">2. Earn Rewards for Your Goals</h2>
                <p className="text-md text-white mt-2 sm:mt-3">
                  Check off tasks to gain rewards and use them to tame mysterious creatures in Habitkub.
                </p>
              </div>
            </div>

            {/* Purpose 3 */}
            <div className="container p-3 sm:p-6 lg:p-8 lg:flex">
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

      {/*Footer*/}
      <footer className="bg-gray-900 text-white py-3 sm:py-6 lg:py-2">
        <div className="container mx-auto p-3 flex flex-wrap flex-col justify-around items-center sm:p-6 sm:flex-row lg:p-12 lg:flex-nowrap lg:flex-row">
          <div className="mb-2 text-center sm:mb-4 lg:w-1 lg:mb-0 lg:mr-6">
            <h2 className="text-3xl font-bold">Habitkub</h2>
          </div>
          <div className="lg:flex">
            <div className="sm:flex sm:space-x-5 lg:flex lg:space-x-12">
              <div className="w-full text-center mt-2 sm:w-1/2 sm:mr-0 sm:mt-0 lg:mr-6 lg:w-auto">
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
              <div className="w-full text-center mt-2 sm:mt-0 sm:w-1/2 lg:w-auto">
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
          </div>
        </div>
        <div className="text-center text-md mt-2 sm:mt-4 lg:mt-2">
          <div className="w-1/2 sm:w-1/8 lg:w-1/2 mx-auto border-t-2 border-gray-600 mb-2 sm:mb-3 lg:mb-2"></div>
          <p>&copy; 2023 Habitkub. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Home;
