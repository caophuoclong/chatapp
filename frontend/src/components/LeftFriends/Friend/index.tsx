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
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useToast } from '@chakra-ui/react';
import FriendsApi from '../../../services/apis/Friends.api';
import { changeStatusCode, rejectFriendShip } from '~/app/slices/friends.slice';
import ConversationsApi from '../../../services/apis/Conversations.api';
import IConversation from '../../../interfaces/IConversation';
import { addConversation } from '~/app/slices/conversations.slice';
import {
  ENUM_SCREEN,
  setChoosenConversationID,
  setShowScreen,
} from '~/app/slices/global.slice';

type Props = {
  user: IUser;
  avatarUrl: string;
  isOnline?: boolean;
  friendShipId: string;
  friendId: string;
  isPending?: boolean;
};

export default function Friend({
  user,
  isOnline,
  friendShipId,
  isPending = false,
}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const toast = useToast();
  const dispatch = useAppDispatch();
  const isLargerThanHD = useAppSelector(
    (state) => state.globalSlice.isLargerThanHD
  );
  const createConversation = (e: React.MouseEvent<HTMLDivElement>) => {
    ConversationsApi.createConversationByFriendShip(friendShipId).then(
      (response) => {
        if (response) {
          const data = response.data.data as IConversation;
          console.log(data);
          dispatch(addConversation(data));
          dispatch(setChoosenConversationID(data._id));
          dispatch(setShowScreen(ENUM_SCREEN.CONVERSATIONS));
        }
      }
    );
  };
  const onAccept = async () => {
    try {
      await FriendsApi.handleAccept(friendShipId);
      toast({
        title: t('Success'),
        description: t('Accept__Success'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      dispatch(
        changeStatusCode({
          friendShipId: friendShipId,
          statusCode: {
            code: 'a',
            name: 'Accept',
          },
        })
      );
    } catch (error) {
      toast({
        title: t('Error'),
        description: t('Went__wrong'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };
  const onReject = async () => {
    try {
      await FriendsApi.handleReject(friendShipId);
      toast({
        title: t('Success'),
        description: t('Reject__Success'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      dispatch(rejectFriendShip(friendShipId));
    } catch (error) {
      toast({
        title: t('Error'),
        description: t('Went__wrong'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };
  return (
    <Flex
      paddingY="1rem"
      paddingX=".5rem"
      rounded="md"
      _hover={{
        bg: 'blue.300',
      }}
      alignItems="center"
      gap="1rem"
      role="group"
      onClick={createConversation}
      cursor="pointer"
    >
      <Avatar src={user.avatarUrl}>
        {!isPending && (
          <AvatarBadge
            borderColor={isOnline ? '' : 'papayawhip'}
            bg={isOnline ? 'green.500' : 'tomato'}
            boxSize="1em"
          />
        )}
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
        {isPending ? (
          <MenuList
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
            }}
          >
            <MenuItem
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onAccept();
              }}
            >
              {t('Accept')}
            </MenuItem>
            <MenuItem
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onReject();
              }}
            >
              {t('Reject')}
            </MenuItem>
          </MenuList>
        ) : (
          <MenuList>
            <MenuItem
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setShowInfo(true);
              }}
            >
              {t('Show__Info')}
            </MenuItem>
            <MenuItem>{t('Delete__Friend')}</MenuItem>
          </MenuList>
        )}
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
