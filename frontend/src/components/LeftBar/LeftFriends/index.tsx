import React, { useState } from 'react';
import { Flex, IconButton } from '@chakra-ui/react';
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from 'react-icons/ai';
import AddFriendsModal from './Modals/AddFriendsModal';
import CreateGroupModal from './Modals/CreateGroupModal';

type Props = {};

export default function LeftFriends({}: Props) {
  const [show, setShow] = useState<'addfriend' | 'creategroup' | ''>(
    'addfriend'
  );
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
      {show === 'addfriend' && <AddFriendsModal setShow={() => setShow('')} />}
      {show === 'creategroup' && <CreateGroupModal />}
    </Flex>
  );
}
