import { Flex, useColorMode } from '@chakra-ui/react';
import React from 'react';

import Conversations from '../Conversations';
import FunctionBar from './FunctionBar';
import SearchBar from './SearchBar';

import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import LeftFunction from '../LeftFunction/index';
import LeftFriends from '../LeftFriends';
import { useAppSelector } from '../../app/hooks';
import { ENUM_SCREEN } from '~/app/slices/global.slice';
type Props = {};

export default function LeftBar({}: Props) {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const showScreen = useAppSelector((state) => state.globalSlice.showScreen);
  return (
    <Flex
      width={{
        base: '100%',
        lg: '500px',
      }}
    >
      <Flex
        width={{
          base: '100%',
        }}
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
        {showScreen === ENUM_SCREEN.CONVERSATIONS && <Conversations />}
        {showScreen === ENUM_SCREEN.CONTACTS && <LeftFriends />}
        <Footer />
      </Flex>
    </Flex>
  );
}
