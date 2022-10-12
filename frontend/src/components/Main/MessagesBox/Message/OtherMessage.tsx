import { Box, Flex, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { MessageType } from '../../../../interfaces/IMessage';

type Props = {
  message: React.ReactNode | string;
  time: string;
  type: MessageType;
};

export default function OtherMessage({ message, time, type }: Props) {
  const { colorMode } = useColorMode();
  return (
    <Flex
      maxWidth="80%"
      rounded="lg"
      direction={'row-reverse'}
      paddingX="1rem"
      bg={
        type === MessageType.TEXT
          ? colorMode === 'light'
            ? 'white'
            : 'whiteAlpha.300'
          : 'none'
      }
      width="fit-content"
      boxShadow="rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px"
    >
      <Box>
        <Text fontSize={'16px'} wordBreak="break-word">
          {message}
        </Text>
        <Text
          fontSize={'13px'}
          color={colorMode === 'light' ? '#4F5359' : 'gray'}
          align="left"
        >
          {time}
        </Text>
      </Box>
    </Flex>
  );
}
