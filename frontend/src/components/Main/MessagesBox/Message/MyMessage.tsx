import {
  Avatar,
  Box,
  Circle,
  Flex,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '~/app/hooks';
import {
  IMessage,
  MessageStatusType,
  MessageType,
} from '../../../../interfaces/IMessage';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { BsCheckLg, BsCircle } from 'react-icons/bs';
import { AiFillEye } from 'react-icons/ai';
import { IUser } from '../../../../interfaces/IUser';

type Props = {
  message: React.ReactNode | string;
  time: string;
  _id?: string;
  type: MessageType;
};
const square = '16px';
function ShowStatus(
  lastMessageId: string,
  messages: IMessage[],
  t: TFunction,
  friend?: IUser
) {
  const message = messages.filter(
    (message) => message._id === lastMessageId
  )[0];
  // const message = {
  //   status: MessageStatusType.SEEN,
  // };
  switch (message.status) {
    case MessageStatusType.SENT:
      return (
        <Flex
          border="2px solid"
          borderColor={'blue.300'}
          width={square}
          height={square}
          rounded="full"
          justifyContent={'center'}
          alignItems="center"
        >
          <BsCheckLg size="8px" />
        </Flex>
      );
    case MessageStatusType.RECEIVED:
      return (
        <Flex
          border="2px solid"
          borderColor={'blue.300'}
          width={square}
          height={square}
          rounded="full"
          bg="blue.300"
          justifyContent={'center'}
          alignItems="center"
        >
          <BsCheckLg size="8px" />
        </Flex>
      );
    case MessageStatusType.SEEN:
      return (
        // <Flex
        //   border="2px solid"
        //   borderColor={'blue.300'}
        //   width={square}
        //   height={square}
        //   rounded="full"
        //   bg="blue.300"
        //   justifyContent={'center'}
        //   alignItems="center"
        // >
        <img
          src={`${process.env.REACT_APP_SERVER_URL}/images/${friend?.avatarUrl}`}
          alt={friend?.name + '__' + 'avatar'}
          style={{
            width: square,
            height: square,
            borderRadius: '100%',
          }}
        />
        // </Flex>
      );
    default:
      return (
        <Box
          border="2px solid"
          borderColor={'blue.300'}
          width={square}
          height={square}
          rounded="full"
        >
          {' '}
        </Box>
      );
  }
}

export default function MyMessage({ message, time, _id, type }: Props) {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.userSlice.info);
  const choosenConversationId = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const conversations = useAppSelector(
    (state) => state.conversationsSlice.conversations
  );
  const messages = useAppSelector(
    (state) => state.messageSlice.messages[choosenConversationId].data
  );
  const conversation = conversations.filter(
    (con) => con._id === choosenConversationId
  )[0];
  const latestMessageConversation = conversations.filter((conversation) => {
    if (conversation) {
      return conversation._id === choosenConversationId;
    }
    return false;
  })[0].lastMessage;
  const showMessageRef = useRef<any>();
  useEffect(() => {
    const current = showMessageRef.current;
    if (current) {
      if (type === MessageType.TEXT) current.innerHTML = message;
      else {
        console.log(message);
      }
    }
  }, [showMessageRef]);
  return (
    <Flex
      maxWidth="80%"
      marginLeft={'auto'}
      rounded="lg"
      direction={'row'}
      // bg={
      //   type === MessageType.TEXT
      //     ? colorMode === 'light'
      //       ? 'white'
      //       : 'whiteAlpha.300'
      //     : 'none'
      // }
      justifyContent="flex-end"
      minWidth="100px"
      width="fit-content"
      className="message"
    >
      <Box>
        <Flex gap=".2rem">
          <Box
            fontSize={'16px'}
            wordBreak="break-word"
            padding=".5rem"
            rounded="xl"
            roundedTopRight={'none'}
            bg={
              type === MessageType.TEXT
                ? colorMode === 'light'
                  ? 'blue.300'
                  : 'purple.600'
                : 'none'
            }
          >
            {type === MessageType.TEXT ? (
              <Text ref={showMessageRef}></Text>
            ) : (
              message
            )}
          </Box>
          {_id &&
            latestMessageConversation &&
            _id === latestMessageConversation._id && (
              <Text alignSelf={'flex-end'}>
                {ShowStatus(
                  latestMessageConversation._id,
                  messages,
                  t,
                  conversation.participants.filter(
                    (participant) => participant._id !== user._id
                  )[0]
                )}
              </Text>
            )}
        </Flex>
        <Flex
          fontSize={'13px'}
          color={colorMode === 'light' ? '#4F5359' : 'gray'}
          align="left"
          justifyContent={'space-between'}
          gap="1rem"
        >
          {time}
        </Flex>
      </Box>
    </Flex>
  );
}
