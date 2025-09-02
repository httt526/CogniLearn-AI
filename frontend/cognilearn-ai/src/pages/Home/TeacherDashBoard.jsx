import { useState } from 'react';
import Navbar from '../../components/Layouts/Navbar';

const TeacherDashboard = ({ userInfo }) => {


  return (
    <div className="flex h-screen bg-gray-50">
      {/* 🔹 Sidebar (Navbar) */}
      <Navbar />

      {/* 🔹 Main Content */}
      <main className="flex-1 p-6 main-content">
        Dashboard
      </main>
    </div>
  );
};

export default TeacherDashboard;
