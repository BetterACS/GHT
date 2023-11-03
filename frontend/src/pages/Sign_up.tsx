import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Sign_up = () => {
  // Define state variables for form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  // Handle form submission
  const handleSubmit = (e:any) => {
    e.preventDefault();
    // You can add your logic for handling the form submission here
    // Typically, this is where you'd make an API request to register the user.
    axios.post("http://localhost:5000/register",{username,email,password})
    .then(result=>{
      console.log(result)
    })
    .catch(err=> console.log(err))
    navigate('/Log_in')
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold text-center">Sign Up</h1>
      <form className="mt-4" onSubmit={handleSubmit}>
        {/* Username Input */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-semibold">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded-md p-2 w-full"
            required
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md p-2 w-full"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md p-2 w-full"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="bg-purple-800 text-white py-2 px-4 rounded-md hover:bg-purple-600">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sign_up;
