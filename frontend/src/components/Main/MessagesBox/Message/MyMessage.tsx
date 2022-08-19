import { Box, Flex, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';

type Props = {
  message: string;
  time: string;
};

export default function MyMessage({ message, time }: Props) {
  const { colorMode } = useColorMode();
  return (
    <Flex
      maxWidth="80%"
      marginLeft={'auto'}
      rounded="lg"
      direction={'row-reverse'}
      paddingX="1rem"
      bg={colorMode === 'light' ? 'blue.200' : 'gray.700'}
      width="fit-content"
    >
      <Box>
        <Text fontSize={'16px'}>{message}</Text>
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
