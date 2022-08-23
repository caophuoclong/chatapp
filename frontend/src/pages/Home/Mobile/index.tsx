import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import LeftBar from '~/components/LeftBar';
import Main from '~/components/Main';

type Props = {};

export default function Mobile({}: Props) {
  const { id } = useParams();
  return (
    <Flex height="100vh" boxSizing="border-box" width={'100%'}>
      {id ? <Main /> : <LeftBar />}
    </Flex>
  );
}
