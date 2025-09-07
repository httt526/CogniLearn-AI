import React from 'react';
import { Button } from '@mantine/core';

const DangerZoneCard = () => {
  const handleDeleteAccount = () => {
    // Nên dùng một modal xác nhận thay cho window.confirm trong ứng dụng thực tế
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) {
      // Logic để gọi API xóa tài khoản
      console.log('Xóa tài khoản');
      alert('Tài khoản đã được xóa.');
    }
  };

  return (
    <div className="bg-white border-2 border-red-300 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-red-600 mb-4">
        Vùng nguy hiểm
      </h2>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className='mb-4 sm:mb-0'>
          <p className="font-semibold text-gray-800">Xóa tài khoản</p>
          <p className="text-sm text-gray-500">Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.</p>
        </div>
        <Button color="red" onClick={handleDeleteAccount}>
          Xóa tài khoản của tôi
        </Button>
      </div>
    </div>
  );
};

export default DangerZoneCard;
