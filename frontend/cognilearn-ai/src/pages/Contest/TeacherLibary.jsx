import { Text, Title, Modal, Button } from "@mantine/core";
import Navbar from "../../components/Layouts/Navbar";
import axiosInstance from "../../utils/axiosInsantce";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ContestResult from "./ContestResult"; 
import ContestCard from "../../components/Cards/ContestCard";

const TeacherLibrary = ({ userInfo }) => {
  const navigate = useNavigate();
  const [latestContests, setLatestContests] = useState([]);
  const [contestResults, setContestResults] = useState([]);
  const [opened, setOpened] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  const fetchLatestContests = async () => {
    try {
      const res = await axiosInstance.get("/get-contests");
      setLatestContests(res.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy các cuộc thi:", err);
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
    fetchLatestContests();
    fetchContestResults();
  }, [userInfo]);

  return (
    <>
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 p-6 main-content overflow-y-auto">
        <div className="flex items-center justify-between mb-6 text-xl text-[#112D4E] font-semibold">
          📚 Thư viện
        </div>

        <div className="p-5 bg-white shadow rounded-2xl mb-6 text-[#112D4E]">
          <Title order={4}>Bài kiểm tra gần đây</Title>
          <div className="grid grid-cols-5 gap-4 mt-3">
            {latestContests.length > 0 ? (
              latestContests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  name={contest.name}
                  date={contest.created_at}
                  path={"/ranking/" + contest.id}
                />
              ))
            ) : (
              <Text size="sm" color="#112D4E">
                Không có contest nào
              </Text>
            )}
          </div>
        </div>
        
        <div className="p-5 bg-white shadow rounded-2xl mb-6 text-[#112D4E]">
          <Title order={4}>Bài kiểm tra đề xuất</Title>
          <div className="grid grid-cols-5 gap-4 mt-3">
            {latestContests.length > 0 ? (
              latestContests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  name={contest.name}
                  date={contest.created_at}
                  path={"/ranking/" + contest.id}
                />
              ))
            ) : (
              <Text size="sm" color="#112D4E">
                Không có contest nào
              </Text>
            )}
          </div>
        </div>
      </main>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="📑 Báo cáo kết quả"
        size="lg"
        radius="md"
      >
        {selectedResult && (
          <ContestResult result={selectedResult} />
        )}
      </Modal>
    </div>
      <button
        className="w-50 h-16 flex items-center justify-center rounded-full text-white bg-[#112D4E] hover:bg-[#C6E7FF] hover:text-[#112D4E] fixed right-10 bottom-10 cursor-pointer transition-all shadow-lg"
        onClick={() => {
        navigate("/create-contest");
        }}
     >
          Tạo bài kiểm tra
      </button>
    </>
  );
};

export default TeacherLibrary;
