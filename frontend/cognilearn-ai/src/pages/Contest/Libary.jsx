import { Text, Title, Button, Modal, TextInput, ScrollArea, UnstyledButton, Group, Center, SimpleGrid, Table, Pagination } from "@mantine/core";
import Navbar from "../../components/Layouts/Navbar";
import axiosInstance from "../../utils/axiosInsantce";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ContestResult from "./ContestResult"; 
import ContestCard from "../../components/Cards/ContestCard";
import { IconSearch } from "@tabler/icons-react";

const Library = ({ userInfo }) => {
  const navigate = useNavigate();
  const [latestContests, setLatestContests] = useState([]);
  const [contestResults, setContestResults] = useState([]);
  const [opened, setOpened] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState(1);
  const pageSize = 5; // mỗi trang tối đa 20 contest

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

  const handleSearchChange = (event) => {
    setSearch(event.currentTarget.value);
    setActivePage(1); // reset về trang đầu khi search
  };

  const displayedContests = latestContests.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  const startIndex = (activePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedContest = displayedContests.slice(startIndex, endIndex);

  useEffect(() => {
    if (!userInfo?.id) return;
    fetchLatestContests();
    fetchContestResults();
  }, [userInfo]);

  return (
    <div className="flex lexend h-screen bg-gray-50">
      {/* 🔹 Sidebar */}
      <Navbar />

      {/* 🔹 Main Content */}
      <main className="flex-1 p-6 main-content overflow-y-auto">
        <div className="flex items-center justify-between mb-6 text-xl text-[#112D4E] font-semibold">
          Thư viện
        </div>

        {/* 🔹 Danh sách contest */}
        <div className="p-5 bg-white shadow rounded-2xl mb-6 text-[#112D4E]">
          <Title order={4}>Danh sách bài kiểm tra</Title>
          <TextInput
            placeholder="Search contest..."
            mb="md"
            leftSection={<IconSearch size={16} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />

          {paginatedContest.length > 0 ? (
            <SimpleGrid
              cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} // tối đa 5 card 1 hàng
              spacing="lg"
              verticalSpacing="lg"
            >
              {paginatedContest.map((contest) => (
                <ContestCard
                  key={contest.id}
                  name={contest.name}
                  date={contest.created_at}
                  path={`/contest/${contest.id}`}
                  userInfo={contest.author}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Text ta="center" fw={500} mt="md">
              Nothing found
            </Text>
          )}
          {latestContests.length > pageSize && (
            <div className="flex justify-center mt-4">
              <Pagination
                total={Math.ceil(latestContests.length / pageSize)}
                value={activePage}
                onChange={setActivePage}
              />
            </div>
          )}
        </div>

        {/* 🔹 Bảng lịch sử làm bài */}
        <div className="p-5 bg-white shadow rounded-2xl text-[#112D4E]">
          <Title order={4}>Lịch sử làm bài</Title>
          {contestResults.length > 0 ? (
            <Table
              highlightOnHover
              className="mt-3 rounded-lg shadow-sm text-[#112D4E] custom-table"
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
                      className="cursor-pointer text-[#112D4E] hover:underline"
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
        {selectedResult && <ContestResult result={selectedResult} />}
      </Modal>
    </div>
  );
};

export default Library;
