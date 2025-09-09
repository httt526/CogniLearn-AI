import React from 'react';
import { Modal as MantineModal, Group, Button, Text } from '@mantine/core';

export function PopUpModal({ opened, onClose }) {
  return (
    <div className="lexend">
      <MantineModal opened={opened} onClose={onClose} title="Thành công!">
        <Text>Quá trình đã hoàn tất và pop-up đã được hiển thị!</Text>
        <Group position="right" mt="md">
          <Button onClick={onClose}>Đóng</Button>
        </Group>
      </MantineModal>
    </div>
  );
}