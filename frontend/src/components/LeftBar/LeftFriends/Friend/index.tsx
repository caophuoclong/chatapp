import { Avatar, AvatarBadge, Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  avatarUrl: string;
  name: string;
  isOnline?: boolean;
  friendShipId: number;
  friendId: string;
};

export default function Friend({
  avatarUrl,
  name,
  isOnline,
  friendId,
  friendShipId,
}: Props) {
  const navigate = useNavigate();
  return (
    <Flex
      paddingY="1rem"
      paddingX=".5rem"
      rounded="md"
      _hover={{
        bg: 'blue.300',
      }}
      alignItems="center"
      gap="1rem"
    >
      <Avatar src={avatarUrl}>
        <AvatarBadge
          borderColor={isOnline ? '' : 'papayawhip'}
          bg={isOnline ? 'green.500' : 'tomato'}
          boxSize="1em"
        />{' '}
      </Avatar>
      <Text fontWeight={600}>{name}</Text>
    </Flex>
  );
}
