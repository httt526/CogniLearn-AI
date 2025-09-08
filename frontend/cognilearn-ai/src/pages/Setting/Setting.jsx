import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Layouts/Navbar'
import ProfileSettingsCard from "./components/ProfileSettingsCard";
import PasswordSettingsCard from "./components/PasswordSettingsCard";
import DangerZoneCard from "./components/DangerZoneCard";
import { supabase } from "../../utils/supabaseClient"; 
import axiosInstance from '../../utils/axiosInsantce';

const Settings = ({ userInfo }) => {
  // State quản lý dữ liệu cho các form
  const [profileData, setProfileData] = useState(userInfo);
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });

  // Load dữ liệu người dùng vào form khi component được tạo
  useEffect(() => {
    if (userInfo) {
      setProfileData({
        name: userInfo?.name,
        phone: userInfo?.phone,
        address: userInfo?.address,
        class: userInfo?.classes,
      });
      
    }
  }, [userInfo]);

   const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

const handlePasswordSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axiosInstance.post("/change-password", {
      userId: userInfo.id,             
      newPassword: passwordData.new,  
    });

    if (res.data.success) {
      alert("Đổi mật khẩu thành công!");
    } else {
      alert("Có lỗi khi đổi mật khẩu: " + res.data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Lỗi server khi đổi mật khẩu!");
  }
};

  // Hiển thị trạng thái loading nếu chưa có thông tin người dùng
  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-800">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="flex min-h- main-content bg-gray-100 text-gray-800">
      <Navbar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Thiết lập</h1>

          {/* Render các component con và truyền props vào */}
          <ProfileSettingsCard
            userInfo={profileData}
            
          />

          <PasswordSettingsCard
            passwordData={passwordData}
            handlePasswordChange={handlePasswordChange}
            handlePasswordSubmit={handlePasswordSubmit}
          />

          <DangerZoneCard />
        </div>
      </main>
    </div>
  );
};

export default Settings;
