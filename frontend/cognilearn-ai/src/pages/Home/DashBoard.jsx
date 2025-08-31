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
import { Center, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from '../NavbarMinimal.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

function NavbarLink({ icon: Icon, label, active, onClick, path }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); // 🔹 Nếu có onClick thì gọi hàm
    } else if (path) {
      navigate(path); // 🔹 Nếu có path thì navigate
    }
  };

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={handleClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Home', path: '/' },
  { icon: IconGauge, label: 'Dashboard', path: '/dashboard' },
  { icon: IconDeviceDesktopAnalytics, label: 'Libary', path: '/libary' },
  { icon: IconCalendarStats, label: 'Releases' },
  { icon: IconUser, label: 'Account' },
  { icon: IconFingerprint, label: 'Security' },
  { icon: IconSettings, label: 'Settings' },
];

const Dashboard = ({ userInfo }) => {
  const location = useLocation(); // 🟢 lấy path hiện tại

  const links = mockdata.map((link) => (
    <NavbarLink
      key={link.label}
      icon={link.icon}
      label={link.label}
      path={link.path}
      active={location.pathname === link.path}
    />
  ));

  return (
    <div className="p-5">
      {userInfo?.role === 'student' ? (
        <nav className={classes.navbar}>
          <Center>
            <MantineLogo type="mark" size={30} />
          </Center>

          <div className={classes.navbarMain}>
            <Stack justify="center" gap={0}>
              {links}
            </Stack>
          </div>

          <Stack justify="center" gap={0}>
            <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
            <NavbarLink icon={IconLogout} label="Logout" onClick={handleLogout}/>
          </Stack>
        </nav>
      ) : <nav className={classes.navbar}>
          <Center>
            <MantineLogo type="mark" size={30} />
          </Center>

          <div className={classes.navbarMain}>
            <Stack justify="center" gap={0}>
              {links}
            </Stack>
          </div>

          <Stack justify="center" gap={0}>
            <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
            <NavbarLink icon={IconLogout} label="Logout" onClick={handleLogout}/>
          </Stack>
        </nav>}
    </div>
  );
};

export default Dashboard;
