import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Text, useColorMode } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RiContactsBook2Fill, RiSettings3Fill } from 'react-icons/ri';
import { AiFillHome } from 'react-icons/ai';
import SearchBar from '../LeftBar/SearchBar';

import Footer from '../Footer';
import Info from './Info';
import Setting from '../Settings';
import { FaUserAlt } from 'react-icons/fa';
import { useAppSelector } from '../../app/hooks';
import { IUser } from '~/interfaces/IUser';
import { FiMoreHorizontal } from 'react-icons/fi';
import MoreActionModal from '../Contacts/Mobile/AddFriend/FoundUser/MoreActionModal';

type Props = {};

function DetectShow(show: 'info' | 'settings', id?: string) {
  let user = useAppSelector((state) => state.userSlice.info);
  const friends = useAppSelector((state) => state.friendsSlice.friendShips);

  if (id) {
    friends.forEach((friendShip) => {
      if (friendShip.user._id === id) {
        user = friendShip.user;
      }
    });
  }
  switch (show) {
    case 'info':
      return <Info user={user} id={id} />;
    case 'settings':
      return <Setting />;
  }
}
function DetectShowIcon(
  show: 'info' | 'settings',
  handleShow: (show: 'info' | 'settings') => void
) {
  switch (show) {
    case 'info':
      return (
        <IconButton
          aria-label="Settings"
          onClick={() => {
            handleShow('settings');
          }}
          icon={<RiSettings3Fill size="24px" />}
          bg="none"
        />
      );
    case 'settings':
      return (
        <IconButton
          aria-label="Info"
          onClick={() => {
            handleShow('info');
          }}
          icon={<FaUserAlt size="24px" />}
          bg="none"
        />
      );
  }
}
export default function User({}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const [show, setShow] = useState<'info' | 'settings'>('info');
  const { id } = useParams();
  const [showMoreAction, setShowMoreAction] = useState(false);
  return (
    <Flex direction={'column'} height="100vh" boxSizing="border-box">
      {id ? (
        <Flex
          gap="1rem"
          alignItems={'center'}
          paddingY=".5rem"
          bg="none"
          width="100%"
        >
          <IconButton
            aria-label="Back to contacts"
            variant={'unstyled'}
            fontSize={'24px'}
            icon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          />
          <IconButton
            aria-label="more action"
            variant={'unstyled'}
            fontSize={'24px'}
            marginLeft="auto"
            onClick={() => setShowMoreAction(true)}
            icon={<FiMoreHorizontal />}
          />
        </Flex>
      ) : (
        <Flex
          direction={'row'}
          height="10%"
          paddingX="1rem"
          justifyContent={'center'}
          alignItems="center"
          gap="1rem"
        >
          <SearchBar />
          {DetectShowIcon(show, setShow)}
        </Flex>
      )}
      <Box paddingX={'1rem'} height="85%">
        {DetectShow(show, id)}
      </Box>
      {!id && <Footer />}
      {showMoreAction && (
        <MoreActionModal setShow={() => setShowMoreAction(false)} />
      )}
    </Flex>
  );
}
