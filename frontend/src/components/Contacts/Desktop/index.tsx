import { Flex } from '@chakra-ui/react';
import React from 'react';
import Friends from '~/components/Friends';
import LeftBar from '~/components/LeftBar';
import { useAppSelector } from '../../../app/hooks';
import ListContacts from './ListContacts';

type Props = {};

export default function Desktop({}: Props) {
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  return (
    <Flex height="100vh" boxSizing="border-box" width={'100%'}>
      <>
        <LeftBar />
        <ListContacts />
      </>
    </Flex>
  );
}
