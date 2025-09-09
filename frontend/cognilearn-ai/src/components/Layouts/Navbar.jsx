import { Stack, UnstyledButton } from '@mantine/core';
import {
  IconHome2,
  IconLibrary,
  IconNotification,
  IconUser,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleLogout } from '../../utils/logout';
import classes from '../../pages/NavbarMinimal.module.css';
import Notifications from '../../pages/Home/Notifications';
import { useState } from 'react';
import { Modal } from '@mantine/core';  

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
    <UnstyledButton
      onClick={handleClick}
      className={classes.link}
      data-active={active || undefined}
    >
      <Icon size={20} stroke={1.5} />
      <span className={classes.label}>{label}</span>
    </UnstyledButton>
  );
}

export default function Navbar() {
  const location = useLocation();
  const [opened, setOpened] = useState(false);

  const handleNotification = () => {
    setOpened(true);
  };

  const mockdata = [
    { icon: IconHome2, label: 'Trang chủ', path: '/dashboard' },
    { icon: IconLibrary, label: 'Thư viện', path: '/library' },
    { icon: IconUser, label: 'Tài khoản', path: '/profile' },
    { icon: IconNotification, label: 'Thông Báo', onClick: handleNotification },
    { icon: IconSettings, label: 'Thiết lập', path: '/settings' },
  ];

  const links = mockdata.map((link) => (
    <NavbarLink
      key={link.label}
      icon={link.icon}
      label={link.label}
      path={link.path}
      active={location.pathname === link.path}
      onClick={link.onClick} // ✅ truyền xuống
    />
  ));

  return (
    <nav className={`${classes.navbar} bg-white shadow-md h-fit`}>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconLogout} label="Đăng xuất" onClick={handleLogout} />
      </Stack>

      {/* Modal thông báo */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="📑 Thông báo"
        size="lg"
        radius="md"
      >
        <Notifications />
      </Modal>
    </nav>
  );
}

