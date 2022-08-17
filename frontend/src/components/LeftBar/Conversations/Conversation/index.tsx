import { Avatar, Box, Stack, Text, useColorMode } from '@chakra-ui/react';
import React from 'react'
import { useAppSelector } from '~/app/hooks';
import IConversation from '@interfaces/IConversation';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';


export default function Conversation({name, avatarUrl, lastMessage, lastMessageTime, _id}: IConversation) {
    const {colorMode} = useColorMode();
    const {id} = useParams();
    
  return (
    <Link to={`/message/${_id}`}>
    <Stack padding={"5px"} rounded="lg" margin="1rem" marginX="0" bg={
        id === _id ? colorMode === "dark" ? "whiteAlpha.50": "gray.300" : ""
    } opacity="revert" direction="row" _hover={{
        bg: id===_id ? "" : colorMode === "dark"? "gray.700" : "#f3f3f3"
    }} cursor="pointer">
        <Avatar size='lg' name='Christian Nwamba' src={avatarUrl} />
        <Box>
            <Text fontSize="md" noOfLines={1} userSelect="none" _dark={{
                color: "gray.200"
            }}>{name}</Text>
            <Text fontSize="sm" noOfLines={1} color="gray.500">{lastMessage} · {moment(lastMessageTime).fromNow(true)}</Text>
        </Box>
    </Stack>
    </Link>

  )
}