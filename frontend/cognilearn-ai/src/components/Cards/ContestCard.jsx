import React from "react";
import { IconBookmark, IconHeart, IconShare } from "@tabler/icons-react";
import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Center,
  Group,
  Image,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import "./ArticleCard.css";

export default function ArticleCard({ name, date, path, userInfo }) {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(path);
  };

  return (
    <div className="lexend">
      <Card withBorder radius="md" className="card" onClick={handleNavigate} style={{ cursor: "pointer" }}>
        <Card.Section>
          <Image src="https://i.imgur.com/1Ew4mrb.png" height={180} />
        </Card.Section>
  
        <Badge
          className="rating"
          variant="gradient"
          gradient={{ from: "yellow", to: "red" }}
        >
          Hot
        </Badge>
  
        <Text className="title" onClick={handleNavigate} style={{ cursor: "pointer" }}>
          {name}
        </Text>
  
        <Text style={{ fontSize: "14px", color: "#868e96" }}>
          {new Date(date).toLocaleDateString("vi-VN")}
        </Text>
  
        <Group justify="space-between" className="footer">
          <Center>
            <Avatar
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
              size={24}
              radius="xl"
              style={{ marginRight: "8px" }}
            />
            <Text style={{ fontSize: "14px" }} inline>
              {userInfo}
            </Text>
          </Center>
        </Group>
      </Card>
    </div>
  );
}
