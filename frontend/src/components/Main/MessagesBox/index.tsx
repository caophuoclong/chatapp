import { Box } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function MessagesBox({}: Props) {
  return (
    <Box boxSizing="border-box" maxHeight={{
        lg: "90%"
    }} bg="red.100">MessagesBox</Box>
  )
}