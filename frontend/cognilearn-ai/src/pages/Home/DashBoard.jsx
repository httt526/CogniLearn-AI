import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Layouts/Navbar";
import { Avatar, Text, Title } from "@mantine/core";
import axiosInstance from "../../utils/axiosInsantce";
import StatsCard from "../../components/Cards/StatsCard";

const Dashboard = ({ userInfo }) => {
  const [latestProgresses, setLatestProgresses] = useState([]); // đổi thành array
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.id) return;

    axiosInstance
      .get(`/get-progress/${userInfo.id}`)
      .then((res) => {
        if (res.data?.data) {
          // Lấy tối đa 3 bài làm gần nhất
          const sortedProgress = [...res.data.data]
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 3);
          setLatestProgresses(sortedProgress);
        }
      })
      .catch((err) => console.error("Lỗi khi lấy progress:", err));
  }, [userInfo]);

  const handleContinue = (contestId) => {
    if (contestId) {
      navigate(`/contest/${contestId}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <nav>
        <Navbar />
      </nav>

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Title order={2} className="text-gray-800">
              Welcome back, {userInfo?.name || "Student"} 👋
            </Title>
            <Text size="sm" color="dimmed">
              Manage your dashboard and settings here.
            </Text>
          </div>
          <Avatar
            src={userInfo?.avatar || ""}
            alt="User Avatar"
            radius="xl"
            size="lg"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-4">
            <Title order={4}>Statistics</Title>
            <Text size="sm" color="dimmed">
              Your latest progress overview
            </Text>

            {latestProgresses.length > 0 ? (
              latestProgresses.map((progress, idx) => {
                const progressPercent = Math.round(
                  ((progress.progress.doneQuestions.length || 0) /
                    progress.progress.totalQuestions) *
                    100
                );

                return (
                  <div key={idx} className="mt-4">
                    <StatsCard
                      title={progress.contestName}
                      subtitle="Current Contest"
                      progressPercent={progressPercent}
                      current={progress.progress.doneQuestions.length || 0}
                      total={progress.progress.totalQuestions}
                      onContinue={() => handleContinue(progress.contestId)}
                    />
                  </div>
                );
              })
            ) : (
              <Text size="sm" mt="sm" color="dimmed">
                No progress yet
              </Text>
            )}
          </div>

          <div className="bg-white shadow rounded-xl p-4">
            <Title order={4}>Notifications</Title>
            <Text size="sm" color="dimmed">
              Check recent updates
            </Text>
          </div>

          <div className="bg-white shadow rounded-xl p-4">
            <Title order={4}>Quick Actions</Title>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
