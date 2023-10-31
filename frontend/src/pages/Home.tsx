import React, { useState, useEffect } from 'react';

const Home = () => {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Delay showing the animation by a few seconds
    const delay = setTimeout(() => {
      setShowWelcome(true);
    }, 0); // Adjust the delay as needed (2000 milliseconds = 2 seconds)

    // Clear the delay when the component unmounts
    return () => clearTimeout(delay);
  }, []);


  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-900 text-white py-4 px-8 flex items-center justify-around fixed top-0 left-0 w-full z-10">
        <div className="text-2xl font-bold">
          <a href="/" style={{color : 'white'}}>Habitkub </a>
        </div>
        <div>
        </div>
        <div>
          <button className="bg-gray-900 border-2 border-gray-500 mr-4 white">
            <a href='/Sign_up' style={{color : 'white'}}> Sign Up</a>
          </button>
          <button className="bg-gray-900 border-2 border-gray-500 text-white">
            <a href='/Log_in' style={{color : 'white'}}> Log in</a>
          </button>
        </div>
      </nav>

      <div className="bg-black top-0 left-0 w-full z-5 flex flex-col items-center justify-center">
        <div className={`min-h-screen flex-1 flex flex-col items-center justify-center transform transition-transform duration-700 ${showWelcome ? 'translate-y-0 opacity-100' : '-translate-y-60 opacity-40'}`}>
          <h2 className="text-6xl font-bold text-white">WELCOME HONOURED GUEST</h2>
          <p className="p-4 text-lg text-white mt-4">
            to the birthplace of our dynasty
          </p>
          <button className="bg-black border-2 border-gray-500 shadow-sm shadow-white text-white px-6 py-3 rounded-md mt-4 hover:bg-gray-900">
            Get Started
          </button>
        </div>

        <div className="flex-col p-8 text-center">
          <h2 className="text-4xl font-bold text-white p-12">Our App's Purpose</h2>
          <div className='flex'>
            {/* Purpose 1 */}
            <div className="p-8 text-center container">
              <h2 className="text-4xl font-bold text-white">1. Track Your Habits and Goals</h2>
              <p className="text-lg text-white mt-4">
                Stay accountable by tracking and managing your Habits, Daily goals, and To-Do list with our web app.
              </p>
            </div>

            {/* Purpose 2 */}
            <div className="p-8 text-center container">
              <h2 className="text-4xl font-bold text-white">2. Earn Rewards for Your Goals</h2>
              <p className="text-lg text-white mt-4">
                Check off tasks to gain rewards and use them to tame mysterious creatures in Habitkub.
              </p>
            </div>

            {/* Purpose 3 */}
            <div className="p-8 text-center container">
              <h2 className="text-4xl font-bold text-white">3. Battle Monsters with Friends</h2>
              <p className="text-lg text-white mt-4">
                Fight monsters with other Habiticans! Use the Gold that you earn to buy in-game or custom rewards, like watching an episode of your favorite TV show.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Habitkub. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Home;