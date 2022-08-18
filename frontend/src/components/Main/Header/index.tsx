import { VStack, Flex } from '@chakra-ui/react';
import React from 'react'

type Props = {}

export default function Header({}: Props) {
  return (
    <Flex boxSizing="border-box" minHeight={{
        base:"6%",
        lg: "5%"
    }} bg="blue">Header</Flex>
  )
}