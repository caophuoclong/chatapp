import { Flex } from '@chakra-ui/react'
import React from 'react'
import LeftBar from '~/components/LeftBar'
import Main from '~/components/Main'

type Props = {}

export default function Home({}: Props) {
  return (
    <Flex  height="100vh" boxSizing='border-box' width={"100%"}>
      <LeftBar/>
      <Main/>
    </Flex>
  )
}