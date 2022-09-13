import {
  Avatar,
  Box,
  Image,
  Text,
  Flex,
  IconButton,
  Button,
  Icon,
  MenuList,
  MenuItem,
  MenuButton,
  Menu,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineIdcard, AiOutlineStop } from 'react-icons/ai';
import { GrGroup } from 'react-icons/gr';
import { MdOutlineGroups, MdOutlineReportGmailerrorred } from 'react-icons/md';
import { IUser } from '~/interfaces/IUser';
import FriendsApi from '~/services/apis/Friends.api';
import { StatusCode } from '../../../interfaces/IFriendShip';
import { useToast } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { changeStatusCode, rejectFriendShip } from '~/app/slices/friends.slice';
import ConversationsApi from '~/services/apis/Conversations.api';
import IConversation from '~/interfaces/IConversation';
import {
  ENUM_SCREEN,
  setChoosenConversationID,
  setShowScreen,
} from '~/app/slices/global.slice';
import { addConversation } from '~/app/slices/conversations.slice';

type Props = {
  user: IUser;
  friendShipStatusCode: StatusCode | null;
  setFrienShipStatus: (status: StatusCode | null) => void;
  flag?: 'sender' | 'target' | '';
  friendShipId: string;
};
const ShowButton = (
  statusCode: StatusCode | null,
  handleAddFriend: () => void,
  flag: 'sender' | 'target' | '' = '',
  friendShipId: string
) => {
  const toast = useToast();
  const dispatch = useAppDispatch();
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
  const { t } = useTranslation();
  if (statusCode === null)
    return (
      <Button width="50%" onClick={handleAddFriend}>
        {t('AddFriend')}
      </Button>
    );
  switch (statusCode.code) {
    case 'p':
      return flag === 'target' ? (
        <Menu>
          <MenuButton
            rounded="lg"
            width="50%"
            _hover={{
              bg: 'yellow.300',
            }}
            _active={{
              bg: 'yellow.300',
            }}
            bg="yellow.300"
          >
            Tuy chon
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onAccept}>{t('Accept')}</MenuItem>
            <MenuItem onClick={onReject}>{t('Reject')}</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Button
          width="50%"
          disabled
          _disabled={{
            bg: 'yellow.300',
            cursor: 'not-allowed',
          }}
          _hover={{
            bg: 'yellow.300',
          }}
          _active={{
            bg: 'yellow.300',
          }}
          bg="yellow.300"
        >
          {t('Waitting')}
        </Button>
      );
    case 'a':
      return (
        <Button
          width="50%"
          disabled
          _disabled={{
            bg: 'blue.300',
            cursor: 'not-allowed',
          }}
          _active={{
            bg: 'blue.300',
          }}
          _hover={{
            bg: 'blue.300',
          }}
          bg="blue.300"
        >
          {t('Friend')}
        </Button>
      );
    case 'b':
      return (
        <Button
          width="50%"
          disabled
          _disabled={{
            bg: 'red.300',
            cursor: 'not-allowed',
          }}
          _hover={{
            bg: 'red.300',
          }}
          _active={{
            bg: 'red.300',
          }}
          bg="red.300"
        >
          {t('Blocked')}
        </Button>
      );
  }
};
export default function FoundUser({
  user,
  friendShipStatusCode,
  setFrienShipStatus,
  flag = '',
  friendShipId,
}: Props) {
  const { t } = useTranslation();
  const toast = useToast();
  const myId = useAppSelector((state) => state.userSlice.info._id);
  const handleAddFriend = async () => {
    try {
      const response = await FriendsApi.addFriend(user._id);
      console.log(response);
      toast({
        title: t('Success'),
        description: t('Send__Request__Success'),
        status: 'success',
        duration: 3000,
        position: 'top-right',
      });
      setFrienShipStatus({
        code: 'p',
        name: 'Pending',
      });
    } catch (error) {
      console.log(error);
      toast({
        title: t('Error'),
        description: t('Send__Request__Fail'),
        status: 'error',
        duration: 3000,
        position: 'top-right',
      });
    }
  };
  const dispatch = useAppDispatch();
  const handleCreateConversation = () => {
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
  return (
    <Box boxSizing="border-box" maxHeight={'600px'}>
      {/* Profile photo  */}
      <Box height="200px" marginX=".5rem">
        {/* Cover */}
        <Box width="full" height="130px">
          <Image
            src={'https://picsum.photos/200'}
            alt=""
            width="100%"
            height="130px"
          />
        </Box>
        {/* Name and avatar */}
        <Flex
          justifyContent={'center'}
          alignItems="center"
          direction={'column'}
          position="relative"
          transform={'translateY(-32px)'}
        >
          <Avatar src={user.avatarUrl} size="lg" />
          <Text fontWeight={700}>{user.name}</Text>
        </Flex>
      </Box>
      {/* action */}
      {myId !== user._id && (
        <Flex gap="1rem" justifyContent={'center'} marginX=".5rem">
          {ShowButton(
            friendShipStatusCode,
            handleAddFriend,
            flag,
            friendShipId
          )}
          <Button width="50%" onClick={handleCreateConversation}>
            {t('Message')}
          </Button>
        </Flex>
      )}
      <Box
        border="3px solid rgba(0,0,0,0.02)"
        bg="rgba(0,0,0,0.02)"
        marginY={'1rem'}
      ></Box>
      {/* Profile Detail */}
      <Box marginX=".5rem">
        <Text size="2xl" fontWeight={700}>
          {t('PersonalInfo')}
        </Text>
        {/* Personal Info */}
      </Box>
      <Box
        border="3px solid rgba(0,0,0,0.02)"
        bg="rgba(0,0,0,0.02)"
        marginY={'1rem'}
      ></Box>
      <Flex direction={'column'}>
        <Button
          display={'block'}
          textAlign="left"
          bg="none"
          paddingX="0"
          padding="1rem"
          height="60px"
          rounded="none"
          fontWeight={'normal'}
        >
          <Flex direction="column" gap="1rem">
            <Flex gap="1rem">
              <MdOutlineGroups fontSize={'24px'} />
              <Box borderBottom="2px solid rgba(0,0,0,0.08)" width="100%">
                <Text>{t('CommonGroup')} (0)</Text>
              </Box>
            </Flex>
          </Flex>
        </Button>
        <Button
          display={'block'}
          textAlign="left"
          bg="none"
          padding="1rem"
          height="60px"
          rounded="none"
          fontWeight={'normal'}
        >
          <Flex direction="column" gap="1rem">
            <Flex gap="1rem">
              <AiOutlineIdcard fontSize={'24px'} />
              <Box borderBottom="2px solid rgba(0,0,0,0.08)" width="100%">
                <Text>{t('ShareContact')}</Text>
              </Box>
            </Flex>
          </Flex>
        </Button>
        <Button
          display={'block'}
          textAlign="left"
          bg="none"
          padding="1rem"
          height="60px"
          rounded="none"
          fontWeight={'normal'}
        >
          <Flex direction="column" gap="1rem">
            <Flex gap="1rem">
              <AiOutlineStop fontSize={'24px'} />
              <Box borderBottom="2px solid rgba(0,0,0,0.08)" width="100%">
                <Text>{t('Block')}</Text>
              </Box>
            </Flex>
          </Flex>
        </Button>
        <Button
          display={'block'}
          textAlign="left"
          bg="none"
          padding="1rem"
          height="60px"
          rounded="none"
          fontWeight={'normal'}
        >
          <Flex direction="column" gap="1rem">
            <Flex gap="1rem">
              <MdOutlineReportGmailerrorred fontSize={'24px'} />
              <Box borderBottom="2px solid rgba(0,0,0,0.08)" width="100%">
                <Text>{t('Report')}</Text>
              </Box>
            </Flex>
          </Flex>
        </Button>
      </Flex>
    </Box>
  );
}