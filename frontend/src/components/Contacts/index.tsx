import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RiContactsBook2Fill, RiSettings3Fill } from 'react-icons/ri';
import { AiFillHome } from 'react-icons/ai';
import SearchBar from '../LeftBar/SearchBar';
import Footer from '../Footer';

type Props = {};

export default function Contacts({}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  return (
    <Flex direction={'column'} height="100vh">
      <Flex
        direction={'column'}
        height="10%"
        paddingX="1rem"
        justifyContent={'center'}
        alignItems="center"
      >
        <SearchBar />
      </Flex>
      <Box paddingX="1rem" height="85%"></Box>

      <Footer />
    </Flex>
  );
}
