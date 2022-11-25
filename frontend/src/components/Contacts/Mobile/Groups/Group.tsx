import { Avatar, Flex, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';

type Props = {
  avatarUrl?: string;
};

export default function Group({ avatarUrl }: Props) {
  const { colorMode } = useColorMode();
  return (
    <Flex gap="1rem" alignItems={'center'} as={'button'} padding="1rem">
      <Avatar src={avatarUrl} />
      <Flex
        borderBottom={
          colorMode === 'dark'
            ? '1px solid rgba(255, 255, 255,0.3)'
            : '1px solid  rgba(0, 0, 0, 0.08)'
        }
        direction="column"
        width="100%"
      >
        <Flex justifyContent={'space-between'}>
          <Text fontWeight={600} fontSize="21px">
            chat nef
          </Text>
          <Text fontSize={14}>38/06</Text>
        </Flex>
        <Text textAlign={'left'} textColor="gray.500">
          Chao banj!
        </Text>
      </Flex>
    </Flex>
  );
}
