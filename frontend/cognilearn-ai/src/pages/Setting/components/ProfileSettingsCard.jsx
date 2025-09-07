import React from 'react';
import { Button } from '@mantine/core';

const ProfileSettingsCard = ({ profileData, handleProfileChange, handleProfileSubmit }) => {
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
            value={profileData.name}
            onChange={handleProfileChange}
            placeholder="Họ và tên"
            className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="text"
            name="phone"
            value={profileData.phone}
            onChange={handleProfileChange}
            placeholder="Số điện thoại"
            className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <input
          type="text"
          name="address"
          value={profileData.address}
          onChange={handleProfileChange}
          placeholder="Địa chỉ"
          className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <input
          type="text"
          name="class"
          value={profileData.class}
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
