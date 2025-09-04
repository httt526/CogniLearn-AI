import { Text, Title, Table, Button, Modal } from "@mantine/core";
import Navbar from "../../components/Layouts/Navbar";
import axiosInstance from "../../utils/axiosInsantce";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ContestResult from "./ContestResult"; 

const Library = ({ userInfo }) => {
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
    <div className="flex h-screen bg-gray-50">
      {/* 🔹 Sidebar */}
      <Navbar />

      {/* 🔹 Main Content */}
      <main className="flex-1 p-6 main-content overflow-y-auto">
        <div className="flex items-center justify-between mb-6 text-xl font-semibold">
          📚 Thư viện
        </div>

        {/* 🔹 Danh sách contest gần đây */}
        <div className="p-5 bg-white shadow rounded-2xl mb-6">
          <Title order={4}>Cuộc thi gần đây</Title>
          <div className="mt-3 space-y-2">
            {latestContests.length > 0 ? (
              latestContests.map((contest) => (
                <div
                  key={contest.id}
                  className="p-3 rounded-md border hover:bg-gray-50 cursor-pointer transition flex items-center justify-between"
                  onClick={() => navigate(`/contest/${contest.id}`)}
                >
                  <Text size="sm" className="text-blue-600 font-medium">
                    {contest.name}
                  </Text>
                  <span className="text-xs text-gray-500">
                    {new Date(contest.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <Text size="sm" color="dimmed">
                Không có contest nào
              </Text>
            )}
          </div>
        </div>

        {/* 🔹 Bảng lịch sử làm bài */}
        <div className="p-5 bg-white shadow rounded-2xl">
          <Title order={4}>📊 Lịch sử làm bài</Title>
          {contestResults.length > 0 ? (
            <Table
              highlightOnHover
              striped="odd"
              className="mt-3 border rounded-lg shadow-sm"
              withTableBorder
              withColumnBorders
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tên Contest</Table.Th>
                  <Table.Th>Điểm</Table.Th>
                  <Table.Th>Ngày làm</Table.Th>
                  <Table.Th style={{ width: "150px", textAlign: "center" }}>Hành động</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {contestResults.map((result) => (
                  <Table.Tr key={result.id}>
                    <Table.Td
                      className="cursor-pointer text-blue-600 hover:underline"
                      onClick={() => navigate(`/contest/${result.contest_id}`)}
                    >
                      {result.name}
                    </Table.Td>
                    <Table.Td>{result.point}</Table.Td>
                    <Table.Td>{new Date(result.created_at).toLocaleString()}</Table.Td>
                    <Table.Td style={{ textAlign: "center" }}>
                      <Button
                        size="xs"
                        variant="light"
                        color="indigo"
                        onClick={() => {
                          setSelectedResult(result);
                          setOpened(true);
                        }}
                      >
                        Xem báo cáo
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

          ) : (
            <Text size="sm" color="dimmed" className="mt-3">
              Bạn chưa có lịch sử làm bài nào
            </Text>
          )}
        </div>
      </main>

      {/* 🔹 Modal Xem Báo Cáo */}
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
  );
};

export default Library;
