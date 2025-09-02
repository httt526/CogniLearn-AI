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

const mockdata = [
  { icon: IconHome2, label: 'Trang chủ', path: '/dashboard' },
  { icon: IconLibrary, label: 'Thư viện', path: '/libary' },
  { icon: IconNotification, label: 'Thông Báo', path: '/notifications' },
  { icon: IconUser, label: 'Tài khoản', path: '/profile' },
  { icon: IconSettings, label: 'Thiết lập', path: '/settings' },
];

export default function Navbar() {
  const location = useLocation();

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
    <nav className={`${classes.navbar} bg-white shadow-md`}>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconLogout} label="Đăng xuất" onClick={handleLogout} />
      </Stack>
    </nav>
  );
}
