import { Box, Flex, useMediaQuery } from '@chakra-ui/react';
import React from 'react';
import LeftBar from '~/components/LeftBar';
import Main from '~/components/Main';
import { useParams } from 'react-router-dom';

type Props = {};

export default function Home({}: Props) {
  const { id } = useParams();
  const [isLargerThanHD] = useMediaQuery(['(min-width: 1024px)']);
  return (
    <Flex height="100vh" boxSizing="border-box" width={'100%'}>
      {isLargerThanHD ? (
        <>
          <LeftBar />
          <Main />
        </>
      ) : id ? (
        <Main/>
      ) : (
        <LeftBar />
      )}
    </Flex>
  );
}
