import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Text, useColorMode } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RiContactsBook2Fill, RiSettings3Fill } from 'react-icons/ri';
import { AiFillHome } from 'react-icons/ai';
import SearchBar from '../LeftBar/SearchBar';

import Footer from '../Footer';
import Info from './Info';
import Setting from '../Settings';
import { FaUserAlt } from 'react-icons/fa';

type Props = {};

function DetectShow(show: 'info' | 'settings') {
  switch (show) {
    case 'info':
      return <Info />;
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
  return (
    <Flex direction={'column'} height="100vh" boxSizing="border-box">
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
      <Box paddingX={'1rem'} height="85%">
        {DetectShow(show)}
      </Box>
      <Footer />
    </Flex>
  );
}
