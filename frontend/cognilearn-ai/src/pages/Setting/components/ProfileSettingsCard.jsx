import React, { useState } from 'react';
import { Button } from '@mantine/core';
import axiosInstance from '../../../utils/axiosInsantce';

const ProfileSettingsCard = ({ userInfo }) => {

  const [profileData, setProfileData] = useState(userInfo);
  
  console.log(profileData);

    const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleProfileSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axiosInstance.post("/profile-update", {
      userInfo: profileData,
    });

    alert("Cập nhật thành công!");
    console.log("Profile updated:", res.data);
  } catch (err) {
    console.error("Update error:", err);
    alert("Có lỗi khi cập nhật!");
  }
};

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
        Thông tin cá nhân
      </h2>
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={profileData?.name}
            onChange={handleProfileChange}
            placeholder="Họ và tên"
            className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="text"
            name="phoneNumber"
            value={profileData?.phoneNumber}
            onChange={handleProfileChange}
            placeholder="Số điện thoại"
            className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <input
          type="text"
          name="address"
          value={profileData?.address}
          onChange={handleProfileChange}
          placeholder="Địa chỉ"
          className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <input
          type="text"
          name="classes"
          value={profileData?.classes}
          onChange={handleProfileChange}
          placeholder="Lớp"
          className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <div className="text-right">
          <Button type="submit" color="indigo">
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettingsCard;
