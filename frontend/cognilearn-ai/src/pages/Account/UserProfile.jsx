import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import { RadarChart } from "@mantine/charts";
import { Card } from "@mantine/core";

// Giả lập một avatar nếu userInfo chưa có
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=John+Doe&background=2d3748&color=fff&size=128";

const UserProfile = ({ userInfo }) => {
  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        Đang tải thông tin người dùng...
      </div>
    );
  }

  // Chuẩn bị dữ liệu cho biểu đồ
  const chartData = userInfo.experiences.map((exp) => ({
    name: exp.name,
    point: exp.point,
  }));

  return (
    <div className="flex min-h-screen bg-gray-50 lexend text-[#112D4E]">
      <Navbar />
      <main className="flex-1 main-content p-8 overflow-y-auto">
        <div className="w-full h-fit max-w-7xl mx-auto">
          {/* --- Profile Header --- */}
          <div className="bg-[#FBFBFB] rounded-xl shadow-lg p-6 flex items-center space-x-6 mb-8">
            <img
              src={userInfo.avatar_url || DEFAULT_AVATAR.replace('John+Doe', userInfo.name.replace(' ', '+'))}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-slate-700"
            />
            <div>
              <h1 className="text-3xl font-bold text-[#112D4E]">{userInfo.name}</h1>
              <p className="text-[#0367B0] font-semibold mt-1">
                {userInfo.role} - Level {userInfo.level}
              </p>
            </div>
          </div>

          {/* --- Main Content Grid --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- Cột thông tin chi tiết (bên trái) --- */}
            <div className="lg:col-span-1 bg-[#FBFBFB] rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#112D4E] mb-6 border-b border-slate-700 pb-3">
                Thông tin chi tiết
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#112D4E]">Liên hệ</p>
                  <p className="font-semibold text-[#112D4E]">{userInfo.phoneNumber || "Chưa cập nhật số điện thoại"}</p>
                </div>
                <div>
                  <p className="text-sm text-[#112D4E]">Lớp</p>
                  <p className="font-semibold text-[#112D4E]">{userInfo.classes || "Chưa tham gia lớp nào"}</p>
                </div>
                <div>
                  <p className="text-sm text-[#112D4E]">Địa chỉ</p>
                  <p className="font-semibold text-[#112D4E]">{userInfo.address || "Chưa cập nhật địa chỉ"}</p>
                </div>
                <div>
                  <p className="text-sm text-[#112D4E]">Ngày tham gia</p>
                  <p className="font-semibold text-[#112D4E]">
                    {new Date(userInfo.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                {/* Bạn có thể thêm các thông tin khác ở đây */}
              </div>
            </div>

            {/* --- Cột Kỹ năng (bên phải) --- */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#112D4E] mb-4">
                Kỹ năng & Kinh nghiệm
              </h2>
              <div className="h-[400px]">
                <Card >
                  <RadarChart
                    h={380}
                    data={userInfo.experiences.map((exp) => ({
                      name: exp.name,
                      point: exp.point,
                    }))}
                    dataKey="name"
                    series={[{ name: "point", color: "indigo.6" }]}
                  />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;