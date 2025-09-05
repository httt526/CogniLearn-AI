import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInsantce";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Layouts/Navbar";
import { TextInput, ScrollArea, Table, Text, UnstyledButton, Group, Center, Pagination } from "@mantine/core";
import { IconSearch, IconChevronDown, IconChevronUp, IconSelector } from "@tabler/icons-react";

const CreateContest = () => {
  const [contestName, setContestName] = useState("");
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("topics");
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [numberPerTopic, setNumberPerTopic] = useState(0);

  // pagination
  const [activePage, setActivePage] = useState(1);
  const pageSize = 10; // số topics mỗi trang

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axiosInstance.get(`/search-topics?query=`);
        setTopics(res.data);
        setFilteredTopics(res.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchTopics();
  }, []);

  // lọc khi search
  const handleSearchChange = (event) => {
    const value = event.currentTarget.value;
    setSearch(value);

    const query = value.toLowerCase().trim();
    const results = topics.filter((t) =>
      String(t.topics).toLowerCase().includes(query)
    );

    setFilteredTopics(results);
    setActivePage(1); // reset về trang đầu khi search
  };

  // sort
  const handleSort = (field) => {
    const reversed = sortBy === field ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);

    const sorted = [...filteredTopics].sort((a, b) => {
      if (reversed) return String(b[field]).localeCompare(String(a[field]));
      return String(a[field]).localeCompare(String(b[field]));
    });

    setFilteredTopics(sorted);
  };

  const handleSelectTopic = (id) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/create-contest", {
        name: contestName,
        topics: selectedTopics,
      });
      alert("Contest created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating contest:", error);
      alert("Failed to create contest!");
    }
  };

  // tính dữ liệu theo trang
  const startIndex = (activePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTopics = filteredTopics.slice(startIndex, endIndex);

  return (
    <div>
      <nav>
        <Navbar />
      </nav>
      <main className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md main-content">
        <h2 className="text-2xl font-bold mb-4">Create Contest</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Contest Name</label>
            <input
              type="text"
              value={contestName}
              onChange={(e) => setContestName(e.target.value)}
              className="w-full border p-2 rounded mt-1"
              placeholder="Điền tên bài kiểm tra"
            />
            <input
              type="text"
              value={numberPerTopic}
              onChange={(e) => setNumberPerTopic(e.target.value)}
              className="w-full border p-2 rounded mt-1"
              placeholder="Điền số câu hỏi cho mỗi chủ đề"
            />
          </div>

          <TextInput
          placeholder="Search topics..."
          mb="md"
          leftSection={<IconSearch size={16} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
        />

          {/* Topics List */}
          <div>
            <label className="block font-medium mb-2">Select Topics</label>
            <ScrollArea className="max-h-64 border rounded">
              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>
                      <UnstyledButton onClick={() => handleSort("topics")}>
                        <Group justify="space-between">
                          <Text fw={500} fz="sm">Topic</Text>
                          <Center>
                            {sortBy === "topics" ? (
                              reverseSortDirection ? (
                                <IconChevronUp size={16} />
                              ) : (
                                <IconChevronDown size={16} />
                              )
                            ) : (
                              <IconSelector size={16} />
                            )}
                          </Center>
                        </Group>
                      </UnstyledButton>
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                  {paginatedTopics.length > 0 ? (
                    paginatedTopics.map((q) => (
                      <Table.Tr key={q.question_id}>
                        <Table.Td>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedTopics.includes(q.question_id)}
                              onChange={() => handleSelectTopic(q.question_id)}
                              className="mr-2"
                            />
                            {q.topics}
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td>
                        <Text ta="center" fw={500}>Nothing found</Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>

            {/* Pagination */}
            {filteredTopics.length > pageSize && (
              <div className="flex justify-center mt-4">
                <Pagination
                  total={Math.ceil(filteredTopics.length / pageSize)}
                  value={activePage}
                  onChange={setActivePage}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Contest
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateContest;
