import {
  Box,
  Flex,
  Hide,
  HStack,
  IconButton,
  Show,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { MdOutlineMoreHoriz } from 'react-icons/md';
import ChangeLanguage from '../Settings/ChangeLanguage';
import ToggleTheme from '../Settings/ToggleTheme';
import Conversations from './Conversations';
import FunctionBar from './FunctionBar';
import SearchBar from './SearchBar';
import { AiFillHome } from 'react-icons/ai';
import { RiContactsBook2Fill, RiSettings3Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';
type Props = {};

export default function LeftBar({}: Props) {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  return (
    <Flex
      width={{
        base: '100%',
        lg: '345px',
      }}
      // paddingRight={{
      //   lg: '1rem',
      // }}
      boxSizing="border-box"
      borderRight={
        colorMode === 'dark'
          ? '1px solid rgba(255, 255, 255,0.3)'
          : '1px solid  rgba(0, 0, 0, 0.08)'
      }
      direction="column"
    >
      <Flex
        height="10%"
        paddingX="1rem"
        boxSizing="border-box"
        zIndex={50}
        justifyContent="center"
        alignItems="center"
        direction={{
          lg: 'column',
        }}
        gap=".3rem"
      >
        <FunctionBar />
        <SearchBar />
      </Flex>

      <Conversations />
      <Footer />
    </Flex>
  );
}
