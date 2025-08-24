import React from 'react'
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

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/interview-prep/:sessionId" element={<InterviewPrep/>}/>        
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/dashboard" element={<DashBoard/>}/>
          <Route path="/contest/:id" element={<Contest/>}/>
          <Route path="/create-contest" element={<CreateContest/>}/>
          <Route path="/contest-result/:id" element={<ContestResult/>}/>
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