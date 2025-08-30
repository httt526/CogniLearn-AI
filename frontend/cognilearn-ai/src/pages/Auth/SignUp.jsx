import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInsantce';
import toast from 'react-hot-toast';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student'); 

  const handleSignUp = async () => {
  try {
    const res = await axiosInstance.post('/signup', { name, email, password, role });

    if (res.data?.user) {
      navigate('/login');
      toast.success('Sign Up successful! Please confirm your email and Login.');
    } else {
      setError('Sign Up failed: No token returned');
    }
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.error || 'Sign Up failed');
  }
};


  useEffect(() => {
    const user = localStorage.getItem('user');  
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 p-6 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {/* Name input */}
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 mb-4 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 👇 Dropdown chọn role */}
        <select
          className="w-full p-2 mb-4 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit */}
        <button
          className="w-full bg-blue-500 text-white p-2 rounded cursor-pointer"
          onClick={handleSignUp}
        >
          Sign Up
        </button>

        {/* Error */}
        {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

        {/* Navigate login */}
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
