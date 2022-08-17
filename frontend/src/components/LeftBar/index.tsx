import { Box, Flex, Hide, Show, VStack } from '@chakra-ui/react'
import React from 'react'
import ChangeLanguage from '../Settings/ChangeLanguage'
import ToggleTheme from '../Settings/ToggleTheme'
import Conversations from './Conversations'
import FunctionBar from './FunctionBar'
import SearchBar from './SearchBar'

type Props = {}

export default function LeftBar({}: Props) {
  return (
    <Box width={{
        base: "100%",      
      lg: "18%"
    }}  paddingRight={{
      lg: "1rem"
    }} boxSizing='border-box'>
      <Box height={{
        base: "10%",
        lg: "15%"
      }} marginBottom={"1rem"} padding="1rem" boxSizing='border-box'>
        <FunctionBar/>
        <SearchBar/>
      </Box>
      <Conversations/>
      <Show breakpoint='(max-width: 1024px)'>
        <VStack  height="4%" bg={"#f3f3f3"} boxSizing="border-box"></VStack>
      </Show>
    </Box>
  )
}