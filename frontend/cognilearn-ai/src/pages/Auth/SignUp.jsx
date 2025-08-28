import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInsantce';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  const handleSignUp = async (e) => {
    try{
      const res = await axiosInstance.post('/signup', { name, email, password });
      if(res.data.user){
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      }
    }catch(err){
      console.log(err);
      setError(err.response?.data?.error || 'Sign Up failed');
    }
  };
  return (
    <>
    <div className='flex justify-center items-center h-screen'>
      <div className='w-96 p-6 border rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold mb-4 text-center'>Sign Up</h2>
        <input type="name" placeholder='Name' className='w-full p-2 mb-4 border rounded' value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder='Email' className='w-full p-2 mb-4 border rounded' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder='Password' className='w-full p-2 mb-4 border rounded' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className='w-full bg-blue-500 text-white p-2 rounded cursor-pointer' onClick={handleSignUp}> Sign Up </button>
        {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
        <p className='mt-4 text-center'>Already have an account? <span className='text-blue-500 cursor-pointer' onClick={() => navigate('/login')}>Login</span></p>
      </div>
    </div>
    </>
  )
}

export default SignUp