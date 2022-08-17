import React from 'react'
import { Flex, Hide, Show } from '@chakra-ui/react';

type Props = {}

export default function Main({}: Props) {
  return (
    <Show above="lg">
    <Flex width={{
        lg: "70%"
    }}  >Main</Flex>
    </Show>
  )
}