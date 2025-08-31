import { useState } from 'react';
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
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={() => navigate(path)}
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
  { icon: IconUser, label: 'Account' },
  { icon: IconSettings, label: 'Settings' },
];

const Dashboard = ({ userInfo }) => {
  const location = useLocation(); // 🟢 lấy path hiện tại
  const [active, setActive] = useState(2);

  const links = mockdata.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      icon={link.icon}
      label={link.label}
      path={link.path}
      onClick={() => setActive(index)}
      active={location.pathname === link.path}
    />
  ));

  return (
    <div className="p-5">
      {userInfo?.role === 'student' ? (
         <nav className={classes.navbar}>
      <Center>
        <MantineLogo type="mark" inverted size={30} />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </nav>
      ) : null}
    </div>
  );
};

export default Dashboard;
