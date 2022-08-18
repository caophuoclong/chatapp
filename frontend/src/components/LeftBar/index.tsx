import { Box, Flex, Hide, HStack, Show, VStack } from '@chakra-ui/react';
import React from 'react';
import ChangeLanguage from '../Settings/ChangeLanguage';
import ToggleTheme from '../Settings/ToggleTheme';
import Conversations from './Conversations';
import FunctionBar from './FunctionBar';
import SearchBar from './SearchBar';

type Props = {};

export default function LeftBar({}: Props) {
  return (
    <Box
      width={{
        base: '100%',
        lg: '18%',
      }}
      // paddingRight={{
      //   lg: '1rem',
      // }}
      boxSizing="border-box"
    >
      <Flex
        height="10%"
        paddingX="1rem"
        boxSizing="border-box"
        bg="white"
        zIndex={50}
        justifyContent="center"
        alignItems="center"
        direction={{
          lg: 'column',
        }}
      >
      <Box
    display={{
      base: "none",
      lg: "flex"
    }}
    >FunctionBar</Box>
        <SearchBar />
      </Flex>

      <Conversations />
      <VStack
        height="5%"
        bg={'#f3f3f3'}
        boxSizing="border-box"
        display={{
          base: 'flex',
          lg: 'none',
        }}
      ></VStack>
    </Box>
  );
}
