import { Flex } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function InputBox({}: Props) {
  return (
    <Flex marginTop="auto" boxSizing="border-box" minHeight={{
        base: "6%",
        lg: "5%"
    }} bg="gray.100">InputBox</Flex>
  )
}