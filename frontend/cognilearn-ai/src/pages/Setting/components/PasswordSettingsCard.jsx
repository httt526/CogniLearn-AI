import React from 'react';
import { Button } from '@mantine/core';

const PasswordSettingsCard = ({ passwordData, handlePasswordChange, handlePasswordSubmit }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
        Đổi mật khẩu
      </h2>
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <input
          type="password"
          name="current"
          value={passwordData.current}
          onChange={handlePasswordChange}
          placeholder="Mật khẩu hiện tại"
          className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <input
          type="password"
          name="new"
          value={passwordData.new}
          onChange={handlePasswordChange}
          placeholder="Mật khẩu mới"
          className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <input
          type="password"
          name="confirm"
          value={passwordData.confirm}
          onChange={handlePasswordChange}
          placeholder="Xác nhận mật khẩu mới"
          className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <div className="text-right">
          <Button type="submit" color="indigo">
            Cập nhật mật khẩu
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordSettingsCard;
