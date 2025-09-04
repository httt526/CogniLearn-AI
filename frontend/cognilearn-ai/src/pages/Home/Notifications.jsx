import Navbar from '../../components/Layouts/Navbar'
import React, { useState, useEffect } from 'react';
// Import Mantine từ CDN để giải quyết lỗi không tìm thấy thư viện
import { MantineProvider, Pagination } from '@mantine/core';

const mockNotifications = [
    { id: 1, title: 'none', date: 'unknown' },
    ...Array.from({ length: 9 }, (_, i) => ({ id: i + 2, title: '', date: '' }))
];

const NotificationItem = ({ notification }) => (
  <div className="grid grid-cols-4 gap-10 items-center bg-gray-50 hover:bg-gray-100 py-2 rounded-lg transition-colors duration-200">
    {/* Sử dụng non-breaking space để giữ chiều cao cho ô trống */}
    <div className="ml-1 font-medium text-left" style={{ color: '#112D4E' }}>{notification.title || '\u00A0'}</div>
    <div className=" text-gray-500 text-right">{notification.date || '\u00A0'}</div>
  </div>
);

const Notifications = () => {
  const [notifications] = useState(mockNotifications);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // Giả sử có 10 trang

  return (
    <div className=' bg-gray-50'>  
      <main>
        <MantineProvider>
          <div className="flex-1 p-6 ">
            <div className="w-full max-w-7xl h-fit bg-white rounded-2xl shadow-lg p-6 mx-auto">
              {/* Header */}
              <header className="grid grid-cols-4 gap-4 items-center bg-[#112D4E] text-white font-bold px-6 py-4 rounded-lg mb-4 text-sm">
                <div className="col-span-3 flex items-center cursor-pointer">
                  Thông báo 
                </div>
                <div className="col-span-1 flex items-center justify-end cursor-pointer">
                  Thời gian 
                </div>
              </header>

              {/* Danh sách thông báo */}
              <main className="space-y-2">
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </main>

              {/* Phân trang bằng Mantine đã được tùy chỉnh */}
              <div className="flex justify-center mt-8">
                <Pagination 
                  total={totalPages} 
                  value={currentPage} 
                  onChange={setCurrentPage} 
                  color="#0367B0" 
                />
              </div>

            </div>
          </div>
        </MantineProvider>
      </main>
    </div>
  )
}

export default Notifications;