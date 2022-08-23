import React, { useState } from 'react';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from 'react-icons/ai';
import AddFriendsModal from './Modals/AddFriendsModal';
import CreateGroupModal from './Modals/CreateGroupModal';
import { useAppSelector } from '../../app/hooks';
import Friend from './Friend';
import { useTranslation } from 'react-i18next';

type Props = {};

export default function LeftFriends({}: Props) {
  const [show, setShow] = useState<'addfriend' | 'creategroup' | ''>('');
  const friends = useAppSelector((state) => state.friendsSlice.friends);
  const { t } = useTranslation();
  return (
    <Flex direction={'column'}>
      <Flex gap="1rem" justifyContent={'flex-end'} paddingX="1rem">
        <IconButton
          onClick={() => setShow('addfriend')}
          fontSize={'24px'}
          bg="none"
          rounded="full"
          aria-label="add friend button"
          icon={<AiOutlineUserAdd />}
        />
        <IconButton
          onClick={() => setShow('creategroup')}
          fontSize={'24px'}
          bg="none"
          rounded="full"
          aria-label="create group chat button"
          icon={<AiOutlineUsergroupAdd />}
        />
      </Flex>
      <Box paddingX="1rem">
        <Text fontWeight={600}>
          {t('Friends')} ({friends.length})
        </Text>
        {friends.map((friendShip, index) => (
          <Friend
            key={index}
            user={friendShip.user}
            friendShipId={friendShip.friendShipId}
            friendId={friendShip.user._id}
            avatarUrl={friendShip.user.avatarUrl}
          />
        ))}
      </Box>
      {show === 'addfriend' && <AddFriendsModal setShow={() => setShow('')} />}
      {show === 'creategroup' && <CreateGroupModal />}
    </Flex>
  );
}
