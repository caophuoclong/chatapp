import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '~/app/hooks';
import Conversations from '~/components/Conversations';
import LeftBar from '~/components/LeftBar/Mobile';
import Main from '~/components/Main';

type Props = {};

export default function Mobile({}: Props) {
  const id = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  return (
    <Flex height="100vh" boxSizing="border-box" width={'100%'}>
      {id ? <Main /> : <LeftBar />}
    </Flex>
  );
}
