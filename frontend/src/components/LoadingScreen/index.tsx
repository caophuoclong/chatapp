import React from 'react';
import { Flex, Spinner, useColorMode } from '@chakra-ui/react';
import { useAppSelector } from '~/app/hooks';

type Props = {};

export default function LoadingScreen({}: Props) {
  const { colorMode } = useColorMode();
  console.log(colorMode);
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  return (
    <Flex
      justifyContent={'center'}
      alignItems="center"
      width="100vw"
      height="100vh"
      position={'fixed'}
      top={0}
      left={0}
      zIndex={1000000}
      bg={colorMode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)'}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Flex>
  );
}
