import React, { useEffect } from 'react';
import Conversation from './Conversation';
import IConversation from '../../interfaces/IConversation';
import { useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useAppSelector } from '~/app/hooks';

type Props = {};

export default function Conversations({}: Props) {
  const conversations = useAppSelector(
    (state) => state.conversationsSlice.conversations
  );
  const messages = useAppSelector((state) => state.messageSlice.messages);
  const restedConversations = [...conversations];
  restedConversations.sort((a, b) => {
    return b.updateAt - a.updateAt;
  });

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
      {restedConversations.map((item: IConversation, index) => (
        <Conversation
          {...item}
          key={index}
          lastMessage={
            messages[item._id] &&
            messages[item._id].data &&
            messages[item._id].data.find((m) => m._id === item.lastMessage._id)!
          }
        />
      ))}
    </Box>
  );
}
