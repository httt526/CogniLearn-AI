import React from 'react'
import { AiFillCaretRight } from 'react-icons/ai';

const DashBoard = (userInfo) => {
  
  console.log("User Info in DashBoard:", userInfo);

  return (
    <>
    {userInfo.userInfo?.role === "student" ? (
      <div className='p-5'>
        <h2 className='text-2xl font-semibold mb-4'>Welcome student, {userInfo.userInfo?.name}!</h2>    
      </div>
    ) : (
      <div className='p-5'> 
        <h2 className='text-2xl font-semibold mb-4'>Welcome teacher, {userInfo.userInfo?.name}!</h2>
      </div>
    )}
    </>
  )
}

export default DashBoard