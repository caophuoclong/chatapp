import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ModalShowInfo from '~/components/ModalShowInfo';
import { IUser } from '~/interfaces/IUser';
import { useAppSelector } from '~/app/hooks';
import { useAppDispatch } from '../../../../app/hooks';
import ConversationsApi from '~/services/apis/Conversations.api';
import IConversation from '../../../../interfaces/IConversation';
import { addConversation } from '~/app/slices/conversations.slice';
import {
  setChoosenConversationID,
  setShowScreen,
} from '~/app/slices/global.slice';
import { ENUM_SCREEN } from '../../../../app/slices/global.slice';
import { SERVER_URL } from '~/configs';

type Props = {
  user: IUser;
  avatarUrl: string;
  isOnline?: boolean;
  friendShipId: string;
  friendId: string;
};

export default function Friend({ user, isOnline, friendShipId }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const conversations = useAppSelector(
    (state) => state.conversationsSlice.conversations
  );
  const socket = useAppSelector((state) => state.globalSlice.socket);
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const dispatch = useAppDispatch();
  const createConversation = (e: React.MouseEvent<HTMLDivElement>) => {
    ConversationsApi.createConversationByFriendShip(friendShipId).then(
      (response) => {
        if (response) {
          const data = response.data.data as IConversation;
          navigate('/');
          dispatch(addConversation(data));
          dispatch(setChoosenConversationID(data._id));
          dispatch(setShowScreen(ENUM_SCREEN.CONVERSATIONS));
        }
      }
    );
    // let isExist = false;
    // let tempConId = '';

    // conversations.forEach((conversation) => {
    //   if (conversation.type === 'direct') {
    //     if (
    //       conversation.participants.filter((item) => item._id === user._id)
    //         .length
    //     ) {
    //       isExist = true;
    //       tempConId = conversation._id;
    //     }
    //   }
    // });
    // if (!isExist) {
    //   if (socket) {
    //     socket.emit('createConversationFromFriendShip', friendShipId);
    //   }
    //   // ConversationsApi.createConversationByFriendShip(friendShipId).then(
    //   //   (response) => {
    //   //     if (response) {
    //   //       const data = response.data.data as IConversation;
    //   //       dispatch(addConversation(data));
    //   //        dispatch(setChoosenConversationID(data._id));
    //   //        dispatch(setShowScreen(ENUM_SCREEN.CONVERSATIONS));
    //   //     }
    //   //   }
    //   // );
    // } else {
    //   dispatch(setChoosenConversationID(tempConId));
    //   dispatch(setShowScreen(ENUM_SCREEN.CONVERSATIONS));
    // }
  };
  return (
    <Flex
      paddingY="1rem"
      paddingX="1rem"
      rounded="md"
      _hover={{
        bg: 'blue.300',
      }}
      alignItems="center"
      gap="1rem"
      role="group"
      onClick={createConversation}
    >
      <Avatar src={`${SERVER_URL}/images/${user.avatarUrl}`}>
        <AvatarBadge
          borderColor={isOnline ? 'white' : 'papayawhip'}
          bg={isOnline ? 'green.500' : 'tomato'}
          boxSize="1em"
        />{' '}
      </Avatar>
      <Text fontWeight={600}>{user.name}</Text>
      <Menu>
        <MenuButton
          as={Button}
          marginLeft="auto"
          bg="none"
          _hover={{ bg: 'none' }}
          _active={{ bg: 'none' }}
          display={isLargerThanHD ? 'none' : 'flex'}
          _groupHover={{
            display: 'flex',
          }}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
          }}
        >
          <FiMoreHorizontal fontSize={'24px'} />
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              navigate('/user/' + user._id);
            }}
          >
            {t('Show__Info')}
          </MenuItem>
          <MenuItem>{t('Delete__Friend')}</MenuItem>
        </MenuList>
      </Menu>
      {showInfo && (
        <ModalShowInfo
          user={user}
          showInfo={showInfo}
          setShowInfo={(f: boolean) => setShowInfo(f)}
        />
      )}
    </Flex>
  );
}
