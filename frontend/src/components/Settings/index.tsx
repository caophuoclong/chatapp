import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RiContactsBook2Fill, RiSettings3Fill } from 'react-icons/ri';
import { AiFillHome } from 'react-icons/ai';
import SearchBar from '../LeftBar/SearchBar';
import ToggleTheme from './ToggleTheme';
import ChangeLanguage from './ChangeLanguage';
import Footer from '../Footer';

type Props = {};

export default function Setting({}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  return (
    <Flex direction={'column'} height="100vh" boxSizing="border-box">
      <ToggleTheme />
      <ChangeLanguage />
      <Footer />
    </Flex>
  );
}
