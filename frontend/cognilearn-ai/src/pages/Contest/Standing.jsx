import React from 'react'
import Navbar from '../../components/Layouts/Navbar'
import { Modal, Table, Title, Text, Button } from '@mantine/core';
import axiosInstance from '../../utils/axiosInsantce';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ContestResult from './ContestResult';

const Standing = ({}) => {
  const { contestId, name } = useParams();
  const [contestResults, setContestResults] = useState([]);
  const [opened, setOpened] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  const fetchContestResults = async () => {
  try {
    const res = await axiosInstance.get(`/get-contest-result/${contestId}`);
    if (res?.data) {
      setContestResults(res.data);
    }
  } catch (err) {
    console.log(err);
  }
};


  useEffect(() => {
  fetchContestResults();
}, [contestId]); 


  return (
    <div>
        <Navbar />
        <div className="p-5 bg-white shadow rounded-2xl mb-6 text-[#112D4E] main-content">
        <Title order={4}>Bảng xếp hạng của {name}</Title>
        {contestResults.length > 0 ? (
          <Table
            highlightOnHover
            className="mt-3 rounded-lg shadow-sm text-[#112D4E] custom-table"
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Học sinh</Table.Th>
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
                  >
                    {result.userName}
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
  )
}

export default Standing