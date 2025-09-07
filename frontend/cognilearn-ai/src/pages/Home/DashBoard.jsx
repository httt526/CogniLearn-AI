import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Layouts/Navbar";
import { Avatar, Text, Title, Button, Progress, rgba, useMantineTheme } from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import axiosInstance from "../../utils/axiosInsantce";
import StatsCard from "../../components/Cards/StatsCard";
import classes from "../../pages/NavbarMinimal.module.css";
import classesProgress from "../ButtonProgress.module.css";
import { PopUpModal } from "../../components/Modal/Popup.jsx";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import { LineChart } from "@mantine/charts";

const Dashboard = ({ userInfo }) => {
  const [latestProgresses, setLatestProgresses] = useState([]);
  const [topicStats, setTopicStats] = useState([]);
  const [contestResults, setContestResults] = useState([]);
  const navigate = useNavigate();
  const theme = useMantineTheme();

  // ==================== FETCH DATA ====================
  const fetchTopicStats = async () => {
    try {
      const res = await axiosInstance.get("/topic-stats-user");
      if (res.data) setTopicStats(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy thống kê chủ đề:", err);
    }
  };

  const fetchContestResults = async () => {
    try {
      const res = await axiosInstance.get(`/get-contest-results?userId=${userInfo.id}&limit=5`);
      setContestResults(res.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy kết quả:", err);
    }
  };

  useEffect(() => {
    if (!userInfo?.id) return;
    axiosInstance
      .get(`/get-progress/${userInfo.id}`)
      .then((res) => {
        if (res.data?.data) {
          const sortedProgress = [...res.data.data]
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 3);
          setLatestProgresses(sortedProgress);
        }
      })
      .catch((err) => console.error("Lỗi khi lấy progress:", err));
    fetchTopicStats();
    fetchContestResults();
  }, [userInfo]);

  // ==================== QUIZ BUTTON LOADING ====================
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);

  const interval = useInterval(
    () =>
      setProgress((current) => {
        if (current < 100) {
          return current + 1;
        }
        interval.stop();
        setLoaded(true);
        return 0;
      }),
    20
  );

  useEffect(() => {
    if (loaded) setModalOpened(true);
  }, [loaded]);

  const handleCloseModal = () => setModalOpened(false);

  const handleContinue = (contestId) => {
    if (contestId) navigate(`/contest/${contestId}`);
  };

  // ==================== CHART DATA ====================
  const barChartData = topicStats.map((item) => ({
    topic: item.topic,
    percent: item.total > 0 ? (item.correct / item.total) * 100 : 0,
  }));

  return (
    <>
      <div className="flex h-fit bg-gray-50">
        {/* NAVBAR */}
        <nav>
          <Navbar />
        </nav>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 main-content">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <Title order={2} className="text-gray-800">
              Welcome back, {userInfo?.name || "Khách"}
            </Title>
            <div className="flex items-center gap-4">
              <Text size="sm" color="dimmed">
                {userInfo?.name || "Khách"}
              </Text>
              <Avatar
                src={userInfo?.avatar || ""}
                alt="User Avatar"
                radius="xl"
                size="lg"
                className="cursor-pointer hover:opacity-80 transition"
                onClick={() => navigate("/profile")}
              />
            </div>
          </div>

          {/* DASHBOARD GRID */}
          <div className="flex gap-6 mt-6 mb-4 w-full">
            {/* LEFT CONTENT */}
            <div className="flex flex-col gap-6 w-full">
              {/* Radar + Line side by side */}
              <div className="bg-white rounded-xl shadow p-4 w-full h-[400px]">
                <div className="grid grid-cols-2 gap-4 w-full h-full">
                  {/* Radar Chart */}
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={userInfo.experiences || []}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis />
                      <Radar
                        dataKey="point"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>

                  {/* Line Chart */}
                  <div className="flex justify-center items-center">
                    <LineChart
                      h={300}
                      data={contestResults}
                      dataKey="created_at"
                      series={[{ name: "point", color: "indigo.6" }]}
                    />
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-xl shadow p-4 w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topic" />
                    <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                    <Tooltip formatter={(val) => `${val.toFixed(1)}%`} />
                    <Legend />
                    <Bar dataKey="percent" fill="#78C841" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SIDEBAR */}
            <div
              className={`${classes.toolBar} grid grid-cols-1 gap-6 w-full max-w-md mb-5 z--10`}
            >
              {/* Quiz Button */}
              <div
                className="bg-white shadow rounded-xl p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <Title order={4}>Định hướng</Title>
                <Text size="sm" color="dimmed">
                  Tìm ra ngành nghề phù hợp nhất với bạn
                </Text>
                <Button
                  fullWidth
                  className={`${classesProgress.button} mt-4`}
                  onClick={() =>
                    loaded ? setLoaded(false) : !interval.active && interval.start()
                  }
                  color={loaded ? "teal" : "#0367B0"}
                  radius="md"
                >
                  <div className={classesProgress.label}>
                    {progress !== 0
                      ? "ĐANG TẢI..."
                      : loaded
                      ? "THÀNH CÔNG!"
                      : "KIỂM TRA NGAY"}
                  </div>
                  {progress !== 0 && (
                    <Progress
                      value={progress}
                      className={classesProgress.progress}
                      color={rgba(theme.colors.blue[2], 0.5)}
                      radius="sm"
                    />
                  )}
                </Button>
              </div>

              {/* Progress List */}
              <div className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition-shadow duration-300">
                <Title order={4}>Thống kê</Title>
                <Text size="sm" color="dimmed">
                  Tổng quan về tiến độ mới nhất của bạn
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
              <div className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition-shadow duration-300">
                <Title order={4}>Chat với trợ lý của bạn</Title>
                <Text size="sm" color="dimmed">
                  Trò chuyện với AI để được hỗ trợ học tập và định hướng nghề nghiệp
                </Text>
                <Button
                  fullWidth
                  className={`${classesProgress.button} mt-4`}
                  onClick={() =>
                    navigate("/cogni-chat/new")
                  }
                  color={loaded ? "teal" : "#0367B0"}
                  radius="md"
                >
                  Chat ngay
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <PopUpModal opened={modalOpened} onClose={handleCloseModal} />
    </>
  );
};

export default Dashboard;
