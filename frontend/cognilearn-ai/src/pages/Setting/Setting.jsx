import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Layouts/Navbar'
import ProfileSettingsCard from "./components/ProfileSettingsCard";
import PasswordSettingsCard from "./components/PasswordSettingsCard";
import DangerZoneCard from "./components/DangerZoneCard";

const Settings = ({ userInfo }) => {
  // State quản lý dữ liệu cho các form
  const [profileData, setProfileData] = useState({ name: "", phone: "", address: "", class: "" });
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });

  // Load dữ liệu người dùng vào form khi component được tạo
  useEffect(() => {
    if (userInfo) {
      setProfileData({
        name: userInfo.name || "",
        phone: userInfo.phone || "",
        address: userInfo.address || "",
        class: userInfo.classes || "",
      });
    }
  }, [userInfo]);

  // Hàm xử lý thay đổi cho form thông tin
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý thay đổi cho form mật khẩu
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý khi submit form thông tin
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Logic gọi API để cập nhật thông tin
    console.log("Cập nhật thông tin:", profileData);
    alert("Thông tin đã được cập nhật!");
  };

  // Hàm xử lý khi submit form mật khẩu
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    // Logic gọi API để đổi mật khẩu
    console.log("Đổi mật khẩu:", passwordData);
    alert("Mật khẩu đã được thay đổi!");
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cài đặt</h1>

          {/* Render các component con và truyền props vào */}
          <ProfileSettingsCard
            profileData={profileData}
            handleProfileChange={handleProfileChange}
            handleProfileSubmit={handleProfileSubmit}
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
