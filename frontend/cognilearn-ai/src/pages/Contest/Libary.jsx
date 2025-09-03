import { Text, Title } from "@mantine/core";
import Navbar from "../../components/Layouts/Navbar";
import axiosInstance from "../../utils/axiosInsantce";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const Libary = ({userInfo}) => {
  const navigate = useNavigate();
  const [latestContests, setLatestContests] = useState([]);

  const fetchLatestContests = async () => {
    try {
      const res = await axiosInstance.get("/get-contests");
      setLatestContests(res.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy các cuộc thi:", err);
    } 
  }

  useEffect(() => {
    if (!userInfo?.id) return;
    fetchLatestContests();
  }, [userInfo]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 🔹 Sidebar */}
      <Navbar />

      {/* 🔹 Main Content */}
      <main className="flex-1 p-6 main-content">
        <div className="flex items-center justify-between mb-6">
          Libary
        </div>
        <div className="p-4">
            <Title order={4}>Gần đây</Title>
            <div className="mt-3">
              {latestContests.length > 0 ? (
                latestContests.map((contest) => (
                  <div
                    key={contest.id}
                    className="p-2 rounded-md hover:bg-gray-100 cursor-pointer transition"
                    onClick={() => navigate(`/contest/${contest.id}`)}
                  >
                    <Text size="sm" className="text-blue-600 font-medium">
                      {contest.name}
                    </Text>
                  </div>
                ))
              ) : (
                <Text size="sm" color="dimmed">
                  Không có contest nào
                </Text>
              )}
            </div>
          </div>
      </main>
    </div>
  );
};

export default Libary;
