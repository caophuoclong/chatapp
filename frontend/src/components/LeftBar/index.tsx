import { Box, Flex } from '@chakra-ui/react'
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
      sm: "100%",
      lg: "18%"
    }} paddingRight="1rem" boxSizing='border-box'>
      <Box height="15%" marginBottom={"1rem"}>
        <FunctionBar/>
        <SearchBar/>
        <ToggleTheme/>
      <ChangeLanguage/>
      </Box>
      
      <Conversations/>
      
    </Box>
  )
}