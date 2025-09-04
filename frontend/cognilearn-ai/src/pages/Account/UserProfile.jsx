import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import { Card } from "@mantine/core";
import { RadarChart } from "@mantine/charts"; // bạn cũng có thể dùng BarChart nếu muốn

const UserProfile = ({ userInfo }) => {
  if (!userInfo) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 p-6 overflow-y-auto main-content">
        <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>

        {/* Thông tin cơ bản */}
        <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{userInfo.name}</h2>
          <p><strong>Role:</strong> {userInfo.role}</p>
          <p><strong>Level:</strong> {userInfo.level}</p>
          <p><strong>Lớp:</strong> {userInfo.classes || "Chưa có"}</p>
          <p className="text-sm text-gray-500 mt-2">
            Ngày tạo tài khoản: {new Date(userInfo.created_at).toLocaleDateString("vi-VN")}
          </p>
        </Card>

        {/* Biểu đồ kinh nghiệm */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <h2 className="text-xl font-semibold mb-4">Kỹ năng & Kinh nghiệm</h2>
          <RadarChart
            h={300}
            data={userInfo.experiences.map((exp) => ({
              name: exp.name,
              point: exp.point,
            }))}
            dataKey="name"
            series={[{ name: "point", color: "indigo.6" }]}
          />
        </Card>
      </main>
    </div>
  );
};

export default UserProfile;
