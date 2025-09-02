import React from 'react'
import Navbar from '../../components/Layouts/Navbar'

const UserProfile = () => {
  return (
    <div className='flex h-screen bg-gray-50'>  
    <Navbar/>
    <main className='flex-1 p-6'>Profile</main>
    </div>
  )
}

export default UserProfile