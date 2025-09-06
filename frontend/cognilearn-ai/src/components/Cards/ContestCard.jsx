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
import "./ArticleCard.css"; // thay thế cho ArticleCard.module.css nếu bạn muốn css module

export default function ArticleCard({name, date, path, userInfo}) {
  const linkProps = {
    href: path,
    target: "_blank",
    rel: "noopener noreferrer",
  };
  const theme = useMantineTheme();

  return (
    <Card withBorder radius="md" className="card">
      <Card.Section>
        <a {...linkProps}>
          <Image src="https://i.imgur.com/1Ew4mrb.png" height={180} />
        </a>
      </Card.Section>

      <Badge
        className="rating"
        variant="gradient"
        gradient={{ from: "yellow", to: "red" }}
      >
        Hot
      </Badge>

      <Text className="title" component="a" {...linkProps}>
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

        {/* <Group gap={8} mr={0}>
          <ActionIcon className="action">
            <IconHeart size={16} color={theme.colors.red[6]} />
          </ActionIcon>
          <ActionIcon className="action">
            <IconBookmark size={16} color={theme.colors.yellow[7]} />
          </ActionIcon>
          <ActionIcon className="action">
            <IconShare size={16} color={theme.colors.blue[6]} />
          </ActionIcon>
        </Group> */}
      </Group>
    </Card>
  );
}
