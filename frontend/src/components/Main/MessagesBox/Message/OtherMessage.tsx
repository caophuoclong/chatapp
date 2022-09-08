import { Box, Flex, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';

type Props = {
  message: string;
  time: string;
};

export default function OtherMessage({ message, time }: Props) {
  const { colorMode } = useColorMode();
  return (
    <Flex
      maxWidth="80%"
      rounded="lg"
      direction={'row-reverse'}
      paddingX="1rem"
      bg={colorMode === 'light' ? 'white' : 'whiteAlpha.300'}
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
