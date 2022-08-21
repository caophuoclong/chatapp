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
import SearchBar from '../LeftBar/SearchBar';
import Footer from '../Footer';

type Props = {};

export default function Contacts({}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const [isLargerThanHD] = useMediaQuery(['(min-width: 1024px)']);
  return (
    <Flex direction={'column'} height="100vh">
      <Flex
        direction={'row'}
        height="10%"
        paddingX="1rem"
        justifyContent={'center'}
        alignItems="center"
        gap="1rem"
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
      <Box paddingX="1rem" height="85%"></Box>

      <Footer />
    </Flex>
  );
}
