import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/SignUp";
import DashBoard from "./pages/Home/DashBoard";
import LandingPage from './pages/Home/LandingPage';
import InterviewPrep from './pages/Interview/InterviewPrep';
import Contest from './pages/Contest/Contest';
import CreateContest from './pages/Contest/CreateContest';
import ContestResult from './pages/Contest/ContestResult';
import PrivateRoute from './components/PrivateRoute';
import axiosInstance from './utils/axiosInsantce';

const App = () => {
  const [userInfo, SetUserInfo] = useState(null);

   const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        SetUserInfo(null);
        return;
      }
      const res = await axiosInstance.get("/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      SetUserInfo(res.data.user);
    } catch (error) {
      console.error("Fetch profile failed:", error);
      SetUserInfo(null);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    const handleStorageChange = () => {
      fetchProfile();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/interview-prep/:sessionId" element={<InterviewPrep/>}/>        
          <Route path="/login" element={<Login fetchProfile = {fetchProfile}/>}/>
          <Route path="/signup" element={<Signup fetchProfile = {fetchProfile}/>}/>
          <Route path="/contest/:id" element={<Contest userInfo = {userInfo}/>}/>
          <Route path="/create-contest" element={<CreateContest/>}/>
          <Route path="/contest-result/:id" element={<ContestResult/>}/>
          <Route
            path="/dashboard"
            element={
            <PrivateRoute>
              <DashBoard userInfo={userInfo}/>
            </PrivateRoute>
          }
        />
        </Routes>
      </Router>
      <Toaster
        toastOptions={{
          className:"",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </div>
  )
}

export default App