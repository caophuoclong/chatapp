import React from 'react'
import { Box, Flex, Hide, Show } from '@chakra-ui/react';
import Header from './Header';
import MessagesBox from './MessagesBox';
import InputBox from './InputBox';

type Props = {}

export default function Main({}: Props) {
  return (
    <Flex width={{
        base: "100%",
        lg: "82%"
    }}  
    boxSizing="border-box"
    direction={"column"}
    >
      <Header/>
      <MessagesBox/>
      <InputBox/>
    </Flex>
  )
}