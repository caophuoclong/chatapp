import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  IconButton,
  Text,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RiContactsBook2Fill, RiSettings3Fill } from 'react-icons/ri';
import { AiFillHome, AiOutlineUserAdd } from 'react-icons/ai';
import SearchBar from '../../LeftBar/SearchBar';
import Footer from '../../Footer';
import { useAppSelector } from '~/app/hooks';
import Friend from './Friend';
import TabContacts from './TabContacts';

type Props = {};

export default function Contacts({}: Props) {
  const navigate = useNavigate();

  return (
    <Flex direction={'column'} height="100vh">
      <Flex
        direction={'row'}
        // height="10%"
        paddingX="1rem"
        justifyContent={'center'}
        alignItems="center"
        gap="1rem"
        height="75px"
      >
        <SearchBar />
        <IconButton
          aria-label="Add friend"
          bg="none"
          fontSize={'24px'}
          icon={<AiOutlineUserAdd />}
          onClick={() => navigate('/contacts/add')}
        />
      </Flex>
      <TabContacts />

      <Footer />
    </Flex>
  );
}
