import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

const LandingPage = () => {

  const navigate = useNavigate(); 

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');

  const handleCTA = () => {};

  return (
    <div className="w-full min-h-full bg-[#eff4ff]">
      <div className="w-[500px] h-[500px] bg-[#C8E7FA] blur-[65px] absolute top-0 left-0"/>

      <div className="container mx-auto px-4 pt-6 pb-[200px] relative z-10">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-16">
          <div className="text-xl text-blue-950 font-bold">
            COGNILEARN-AI
          </div>

          <button className="bg-linear-to-r from-[#0367B0] to-[#0367B0] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white border border-white transistion-colors cursor-pointer" onClick={() => setOpenAuthModal(true)}>
            ĐĂNG NHẬP/ ĐĂNG KÝ
          </button>

        </header>
        {/* Main Content Section */}
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
            <div className="flex items-center justify-left mb-2">
              <div className="flex-items-center gap-2 text-[13px] text-blue-600 font-semibold bg-blue-100 px-3 py-1 rounded-full border border-blue-600">
                AI Powered
              </div>
            </div>

            <h1 className="text-5xl text-blue-950 font-medium mb-6 leading-tight">
              Cá nhân hóa học tập & hướng nghiệp bằng AI phân tích quá trình tư duy
            </h1>
          </div>

          <div className="w-full md:w-1/2">
            <p className="text-[17px] text-blue-950 mr-0 md:mr-20 mb-6">
              Không chỉ chấm điểm, CogniLearn AI đo lường và phân tích cách bạn suy nghĩ để thiết kế lộ trình học và nghề nghiệp chuẩn xác – dành riêng cho bạn.
            </p>
            <button className="bg-blue-950 text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-blue-400 hover:text-black" onClick={handleCTA}>
              TÌM HIỂU NGAY
            </button> 
          </div>
        </div>
      </div> 
    </div>
  )
}

export default LandingPage