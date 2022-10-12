import { Box, Flex, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { useAppSelector } from '~/app/hooks';
import {
  MessageStatusType,
  MessageType,
} from '../../../../interfaces/IMessage';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

type Props = {
  message: React.ReactNode | string;
  time: string;
  _id?: string;
  type: MessageType;
};

function ShowStatus(status: MessageStatusType, t: TFunction) {
  switch (status) {
    case MessageStatusType.SENT:
      return t('Sent');
    case MessageStatusType.RECEIVED:
      return t('Received');
    case MessageStatusType.SEEN:
      return t('Seen');
    default:
      return t('Sending');
  }
}

export default function MyMessage({ message, time, _id, type }: Props) {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();

  const choosenConversationId = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const conversations = useAppSelector(
    (state) => state.conversationsSlice.conversations
  );
  const messages = useAppSelector(
    (state) => state.messageSlice.messages[choosenConversationId].data
  );
  const lastestMessageId = conversations.filter((conversation) => {
    if (conversation) {
      return conversation._id === choosenConversationId;
    }
    return false;
  })[0].lastMessage._id;
  const lastestMessage = messages.filter(
    (message) => message._id === lastestMessageId
  )[0];

  return (
    <Flex
      maxWidth="80%"
      marginLeft={'auto'}
      rounded="lg"
      direction={'row-reverse'}
      paddingX="1rem"
      bg={
        type === MessageType.TEXT
          ? colorMode === 'light'
            ? 'white'
            : 'whiteAlpha.300'
          : 'none'
      }
      width="fit-content"
    >
      <Box>
        <Text fontSize={'16px'} wordBreak="break-word">
          {message}
        </Text>
        <Flex
          fontSize={'13px'}
          color={colorMode === 'light' ? '#4F5359' : 'gray'}
          align="left"
          justifyContent={'space-between'}
          gap="1rem"
        >
          {time}

          {_id && _id === lastestMessage._id && (
            <Text>{ShowStatus(lastestMessage.status, t)}</Text>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}
