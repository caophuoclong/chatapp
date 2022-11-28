import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { renderAvatar } from '../../utils/renderAvatar';

type Props = {
  avatarUrl: string;
  name: string;
  lastAccess?: string;
};

export default function Contact({ avatarUrl, name, lastAccess }: Props) {
  return (
    <Flex alignItems={'center'} gap="1rem">
      <Avatar src={renderAvatar(avatarUrl)} />
      <Box>
        <Text fontSize={'20px'}>{name}</Text>
        <Text fontSize={'14px'}>{lastAccess}</Text>
      </Box>
    </Flex>
  );
}
