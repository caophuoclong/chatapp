import React, { useEffect } from 'react';
import Conversation from './Conversation';
import IConversation from '../../../interfaces/IConversation';
import { useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useAppSelector } from '~/app/hooks';

type Props = {};

export default function Conversations({}: Props) {
  const conversations = useAppSelector(
    (state) => state.conversationsSlice.conversations
  );
  return (
    <Box
      height={{
        base: '85%',
        lg: '90%',
      }}
      overflow={'auto'}
      paddingX="1rem"
      boxSizing="border-box"
    >
      {conversations.map((item, index) => (
        <Conversation {...item} key={index} />
      ))}
    </Box>
  );
}
