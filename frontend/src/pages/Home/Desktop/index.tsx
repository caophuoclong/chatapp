import { Flex } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import LeftBar from '~/components/LeftBar/Desktop';
import LeftFunction from '~/components/LeftFunction';
import Main from '~/components/Main';
import { useAppDatabase } from '../../../app/hooks';

type Props = {};

export default function Desktop({}: Props) {
  const db = useAppDatabase();

  return (
    <Flex height="100vh" boxSizing="border-box" width={'100%'}>
      <LeftFunction />
      <LeftBar />
      <Main />
    </Flex>
  );
}
