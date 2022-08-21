import { Box, Flex, useMediaQuery } from '@chakra-ui/react';
import React from 'react';
import LeftBar from '~/components/LeftBar';
import Main from '~/components/Main';
import { useLocation, useParams } from 'react-router-dom';
import Contacts from '~/components/Contacts';
import Friends from '~/components/Friends';

type Props = {};

export default function Home({}: Props) {
  const { id } = useParams();
  const [isLargerThanHD] = useMediaQuery(['(min-width: 1024px)']);
  const location = useLocation();

  return (
    <Flex height="100vh" boxSizing="border-box" width={'100%'}>
      {isLargerThanHD ? (
        <>
          <LeftBar />
          {location.pathname.includes('/friends') ? <Friends /> : <Main />}
        </>
      ) : id ? (
        <Main />
      ) : (
        <LeftBar />
      )}
    </Flex>
  );
}
