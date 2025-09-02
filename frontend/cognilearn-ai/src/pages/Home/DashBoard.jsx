import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Layouts/Navbar";
import { Avatar, Text, Title } from "@mantine/core";
import axiosInstance from "../../utils/axiosInsantce";
import StatsCard from "../../components/Cards/StatsCard";
import classes from '../../pages/NavbarMinimal.module.css';
import { Button, Progress, rgba, useMantineTheme } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import classesProgress from '../ButtonProgress.module.css';
import { PopUpModal } from "../../components/Modal/Popup.jsx";

const Dashboard = ({ userInfo }) => {
  const [latestProgresses, setLatestProgresses] = useState([]);
  const [latestContests, setLatestContests] = useState([]);
  const navigate = useNavigate();

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
    fetchLatestContests();
  }, [userInfo]);

  const handleContinue = (contestId) => {
    if (contestId) {
      navigate(`/contest/${contestId}`);
    }
  };

  const theme = useMantineTheme();
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
    if (loaded) {
      setModalOpened(true);
    }
  }, [loaded]);

  const handleCloseModal = () => {
    setModalOpened(false);
  };

  return (
    <>
      <div className="flex h-fit bg-gray-50 ml-20 mr-20 mt-5 mb-5">
        <nav>
          <Navbar />
        </nav>

        <main className="flex-1 p-6 main-content">
          <div className="flex items-center justify-between">
            <div>
              <Title order={2} className="text-gray-800">
                Welcome back, {userInfo?.name || "Khách"} 👋
              </Title>
            </div>
            <div className="flex items-center space-x-4 gap-4">
              <Text size="sm" color="dimmed">
                {userInfo?.name || "Khách"}
              </Text>
              <Avatar
                src={userInfo?.avatar || ""}
                alt="User Avatar"
                radius="xl"
                size="lg"
                className="cursor-pointer hover:opacity-80 transition"
                onClick={() => navigate("/profile")} />
            </div>
          </div>

          <div className={`${classes.toolBar} grid grid-cols-1 gap-6 ml-auto w-full max-w-md mb-5`}>
            <div style={{ padding: '20px' }} className="bg-white shadow rounded-xl p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col" >
              <Title order={4}>Định hướng</Title>
              <Text size="sm" color="dimmed">
                Tìm ra ngành nghề phù hợp nhất với bạn
              </Text>
              <Button
                fullWidth
                className={`${classesProgress.button} mt-4`}
                onClick={() => (loaded ? setLoaded(false) : !interval.active && interval.start())}
                color={loaded ? 'teal' : "#0367B0"}
                radius="md"
              >
                <div className={classesProgress.label}>
                  {progress !== 0 ? 'ĐANG TẢI...' : loaded ? 'THÀNH CÔNG!' : 'KIỂM TRA NGAY'}
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
                        onContinue={() => handleContinue(progress.contestId)} />
                    </div>
                  );
                })
              ) : (
                <Text size="sm" mt="sm" color="dimmed">
                  No progress yet
                </Text>
              )}
            </div>

          </div>
        </main>
      </div>
      <div><PopUpModal opened={modalOpened} onClose={handleCloseModal} /></div>
    </>
  );
};

export default Dashboard;
