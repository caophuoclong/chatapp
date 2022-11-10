import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  useBreakpoint,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import IConversation from '@interfaces/IConversation';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import { setChoosenConversationID } from '~/app/slices/global.slice';
import { IUser } from '../../../interfaces/IUser';
import { useRef } from 'react';
import { SERVER_URL } from '~/configs';
import { AvatarConversation } from './AvatarConversation';
import { MessageType } from '~/interfaces/IMessage';
import { Emoji } from 'emoji-picker-react';
import DropDownMenu from './DropdownMenu';

// export const renderDirectConversation = (participants: IUser[]) => {
//   const myId = useAppSelector((state) => state.userSlice.info._id);
//   return {
//     avatarUrl: participants.filter((item) => item._id !== myId)[0].avatarUrl,
//     name: participants.filter((item) => item._id !== myId)[0].name,
//   };
// };
export const RenderDirectConversationName = ({
  participants,
}: {
  participants: IUser[];
}) => {
  const myId = useAppSelector((state) => state.userSlice.info._id);
  return <>{participants.filter((item) => item._id !== myId)[0].name}</>;
};
export const RenderDirectConversationAvatar = ({
  participants,
  size = 'md',
}: {
  participants: IUser[];
  size?: 'lg' | 'md';
}) => {
  const myId = useAppSelector((state) => state.userSlice.info._id);
  return (
    <Avatar
      size={size}
      src={`${SERVER_URL}/images/${
        participants.filter((item) => item._id !== myId)[0].avatarUrl
      }`}
    />
  );
};
export default function Conversation({
  name,
  avatarUrl,
  lastMessage,
  participants,
  type,
  _id,
  updateAt,
}: IConversation) {
  const [openDropdown, setOpenDropdown] = useState(false);
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
  const contentRef = useRef<HTMLParagraphElement>(null);
  // useEffect(() => {
  //   const p = contentRef.current;
  //   console.log(p);
  //   if (p) {
  //     console.log(p.clientWidth);
  //   }
  // }, [contentRef]);
  const showContentRef = useRef<any>();
  useEffect(() => {
    const { current } = showContentRef;
    if (current) {
      if (lastMessage.type === MessageType.TEXT) {
        current.innerHTML = lastMessage.content;
      }
    }
  }, [showContentRef, lastMessage]);
  const handleOnRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    // console.log(event);
    if (event.button === 2) {
      setOpenDropdown(true);
    } else {
      console.log('left click');
    }
  };

  const onCloseDropDown = () => {
    setOpenDropdown(false);
  };
  const cancelRef = useRef(null);
  return (
    <Stack
      onContextMenu={handleOnRightClick}
      onClick={() => {
        if (choosenConversationID === _id)
          dispatch(setChoosenConversationID(''));
        else dispatch(setChoosenConversationID(_id));
      }}
      position={'relative'}
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
      {type === 'group' && (
        <AvatarConversation
          avatarSize="lg"
          avatarUrl={avatarUrl}
          participants={participants}
          size={64}
        />
      )}
      {type === 'direct' && (
        <RenderDirectConversationAvatar participants={participants} size="lg" />
      )}

      <Box width="80%">
        <Text
          fontSize="md"
          noOfLines={1}
          userSelect="none"
          _dark={{
            color: 'gray.200',
          }}
        >
          {type === 'group' ? (
            name
          ) : (
            <RenderDirectConversationName participants={participants} />
          )}
        </Text>
        {lastMessage ? (
          <Flex>
            <Flex fontSize="sm" color="gray.500" width={'80%'}>
              {lastMessage.type === MessageType.EMOJI ? (
                <Emoji unified={lastMessage.content} size={20} />
              ) : (
                <Text ref={showContentRef} noOfLines={1}></Text>
              )}{' '}
              <Text marginLeft="auto" fontWeight={'bold'}>
                {' '}
                ·{' '}
              </Text>
            </Flex>
            <Text fontSize="sm" noOfLines={1} color="gray.500">
              {moment(new Date(+lastMessage.createdAt || 0)).format('HH:mm')}
            </Text>
          </Flex>
        ) : (
          <Flex>
            <Text fontSize="sm" noOfLines={1} color="gray.500" width="80%">
              You are not have a message in this conversation
            </Text>
            <Text fontSize="sm" noOfLines={1} color="gray.500">
              {moment(new Date(+updateAt)).format('HH:mm')}
            </Text>
          </Flex>
        )}
      </Box>

      <DropDownMenu isOpen={openDropdown} onClose={onCloseDropDown} _id={_id} />
    </Stack>
  );
}
