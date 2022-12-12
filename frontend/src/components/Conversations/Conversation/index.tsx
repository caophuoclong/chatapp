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
  SkeletonText,
  Stack,
  Text,
  useBreakpoint,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react';
import { ImFilePicture } from 'react-icons/im';
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
import { useTranslation } from 'react-i18next';
import { renderAvatar } from '~/utils/renderAvatar';
import { IMessage } from '../../../interfaces/IMessage';

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
      src={renderAvatar(
        participants.filter((item) => item._id !== myId)[0].avatarUrl
      )}
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
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const dispatch = useAppDispatch();
  const choosenConversationID = useAppSelector(
    (state) => state.globalSlice.conversation.choosenConversationID
  );
  const { t } = useTranslation();
  const myId = useAppSelector((state) => state.userSlice.info._id);
  const messagesSlice = useAppSelector((state) => state.messageSlice);
  const messages = messagesSlice.messages;

  const messagesInConversation = messages[_id];
  const [latestMessage, setLatestMessage] = useState<IMessage>();
  useEffect(() => {
    if (messagesInConversation) {
      const messageGroups = messagesInConversation.data;
      messageGroups.forEach((group) =>
        group.forEach((message) => {
          if (message._id === lastMessage._id) {
            setLatestMessage(message);
          }
        })
      );
    }
  }, [lastMessage, messages]);
  const handleOnRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
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
        {messagesSlice.isLoading.messages ? (
          <SkeletonText
            mt="4"
            noOfLines={1}
            spacing="4"
            skeletonHeight="2"
            width={'90%'}
          />
        ) : latestMessage ? (
          latestMessage.isRecall ? (
            <Text color="gray.500" size="sm">
              {t('This__Message__HasBeen__Recalled')}
            </Text>
          ) : (
            <Flex>
              {latestMessage.sender._id === myId ? (
                <Flex fontSize="sm" color="gray.500" width={'80%'}>
                  <Text>{t('You')}:&nbsp;</Text>
                  {latestMessage.type === MessageType.EMOJI ? (
                    <Emoji unified={latestMessage.content || ''} size={20} />
                  ) : latestMessage.type === MessageType.IMAGE ? (
                    <Flex gap="2" alignItems={'center'}>
                      <ImFilePicture fontSize="xs" />
                      <Text>{t('Picture')}</Text>
                    </Flex>
                  ) : (
                    <Text noOfLines={1}>{latestMessage.content}</Text>
                  )}{' '}
                  <Text marginLeft="auto" fontWeight={'bold'}>
                    {' '}
                    ·{' '}
                  </Text>
                </Flex>
              ) : (
                <Flex fontSize="sm" color="gray.500" width={'80%'}>
                  {latestMessage.type === MessageType.EMOJI ? (
                    <Emoji unified={latestMessage.content || ''} size={20} />
                  ) : latestMessage.type === MessageType.IMAGE ? (
                    <Flex gap="2" alignItems={'center'}>
                      <ImFilePicture fontSize="xs" />
                      <Text>{t('Picture')}</Text>
                    </Flex>
                  ) : (
                    <Text noOfLines={1}>{latestMessage.content}</Text>
                  )}{' '}
                  <Text marginLeft="auto" fontWeight={'bold'}>
                    {' '}
                    ·{' '}
                  </Text>
                </Flex>
              )}
              <Text fontSize="sm" noOfLines={1} color="gray.500">
                {moment(new Date(+latestMessage.createdAt! || 0)).format(
                  'HH:mm'
                )}
              </Text>
            </Flex>
          )
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
