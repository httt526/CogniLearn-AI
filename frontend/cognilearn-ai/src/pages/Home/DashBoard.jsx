import { useState } from 'react';
import { handleLogout } from "../../utils/logout"
import {
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconGauge,
  IconHome2,
  IconLogout,
  IconSettings,
  IconSwitchHorizontal,
  IconUser,
} from '@tabler/icons-react';
import { Center, Stack, Tooltip, UnstyledButton, Avatar, Text, Title, Button } from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from '../NavbarMinimal.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

function NavbarLink({ icon: Icon, label, active, onClick, path }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={handleClick}
        className={classes.link} // Áp dụng class chính
        data-active={active || undefined} // Áp dụng data attribute để kích hoạt style
      >
        <Icon size={20} stroke={1.5} />
        <span className={classes.label}>{label}</span>
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Home', path: '/' },
  { icon: IconGauge, label: 'Dashboard', path: '/dashboard' },
  { icon: IconDeviceDesktopAnalytics, label: 'Libary', path: '/libary' },
  { icon: IconUser, label: 'Account' },
  { icon: IconSettings, label: 'Settings' },
];

const Dashboard = ({ userInfo }) => {
  const location = useLocation();

  const links = mockdata.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      icon={link.icon}
      label={link.label}
      path={link.path}
      active={location.pathname === link.path}
    />
  ));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 🔹 Sidebar (Navbar) */}
      <nav className={`${classes.navbar} bg-white shadow-md`}>
        <div className={classes.navbarMain}>
          <Stack justify="center" gap={0}>
            {links}
          </Stack>
        </div>

        <Stack justify="center" gap={0}>
          <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
          <NavbarLink icon={IconLogout} label="Logout" onClick={handleLogout} />
        </Stack>
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
