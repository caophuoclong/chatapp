import {
  Avatar,
  Box,
  Stack,
  Text,
  useBreakpoint,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react';
import React from 'react';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import IConversation from '@interfaces/IConversation';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import { setChoosenConversationID } from '~/app/slices/global.slice';
import { IUser } from '../../../interfaces/IUser';

const renderDirectConversation = (participants: IUser[], myId: string) => {
  return {
    avatarUrl: participants.filter((item) => item._id !== myId)[0].avatarUrl,
    name: participants.filter((item) => item._id !== myId)[0].name,
  };
};

export default function Conversation({
  name,
  avatarUrl,
  lastMessage,
  participants,
  type,
  _id,
}: IConversation) {
  const { colorMode } = useColorMode();
  const { id } = useParams();
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const user = useAppSelector((state) => state.userSlice.info);
  const dispatch = useAppDispatch();
  const choosenConversationID = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  return (
    <Stack
      onClick={() => {
        dispatch(setChoosenConversationID(_id));
      }}
      padding={'5px'}
      rounded="lg"
      margin="1rem"
      marginX="0"
      bg={
        isLargerThanHD && choosenConversationID === _id
          ? colorMode === 'dark'
            ? 'whiteAlpha.50'
            : 'gray.300'
          : ''
      }
      direction="row"
      _hover={{
        bg:
          choosenConversationID === _id
            ? ''
            : colorMode === 'dark'
            ? 'gray.700'
            : '#f3f3f3',
      }}
      cursor="pointer"
    >
      <Avatar
        size="lg"
        name={
          type === 'group'
            ? name
            : renderDirectConversation(participants, user._id).name
        }
        src={
          type === 'group'
            ? avatarUrl
            : renderDirectConversation(participants, user._id).avatarUrl
        }
      />
      <Box>
        <Text
          fontSize="md"
          noOfLines={1}
          userSelect="none"
          _dark={{
            color: 'gray.200',
          }}
        >
          {type === 'group'
            ? name
            : renderDirectConversation(participants, user._id).name}
        </Text>
        {lastMessage ? (
          <Text fontSize="sm" noOfLines={1} color="gray.500">
            {lastMessage.content} ·{' '}
            {moment(lastMessage.createdAt).fromNow(true)}
          </Text>
        ) : (
          <Text fontSize="sm" noOfLines={1} color="gray.500">
            You are not have a message in this conversation
          </Text>
        )}
      </Box>
    </Stack>
  );
}
