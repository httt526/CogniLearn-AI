import { useState } from 'react';
import Navbar from '../../components/Layouts/Navbar';
import { Avatar, Button, Text, Title } from '@mantine/core';

const Dashboard = ({ userInfo }) => {


  return (
    <div className="flex h-screen bg-gray-50">
      {/* 🔹 Sidebar (Navbar) */}
      <nav>
        <Navbar />
      </nav>

      {/* 🔹 Main Content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Title order={2} className="text-gray-800">
              Welcome back, {userInfo?.name + 'Student'} 👋
            </Title>
            <Text size="sm" color="dimmed">
              Manage your dashboard and settings here.
            </Text>
          </div>
          <Avatar src={userInfo?.avatar || ''} alt="User Avatar" radius="xl" size="lg" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-4">
            <Title order={4}>Statistics</Title>
            <Text size="sm" color="dimmed">Your latest progress overview</Text>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <Title order={4}>Notifications</Title>
            <Text size="sm" color="dimmed">Check recent updates</Text>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <Title order={4}>Quick Actions</Title>
            <Button variant="outline" color="blue" mt="sm">Create new</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
