import React, { useState } from 'react';

const Log_in = () => {
  // Define state variables for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission
  const handleSubmit = (e:any) => {
    e.preventDefault();
    // You can add your logic for handling the form submission here
    // Typically, this is where you'd make an API request to authenticate the user.
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold text-center">Log In</h1>
      <form className="mt-4" onSubmit={handleSubmit}>
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
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Log_in;
