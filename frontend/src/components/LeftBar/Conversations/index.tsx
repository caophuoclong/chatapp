import React, { useEffect } from 'react'
import Conversation from './Conversation';
import IConversation from '../../../interfaces/IConversation';
import { useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

type Props = {}

export default function Conversations({}: Props) {
    const conversations: Array<IConversation> = [{
        _id: "ksf",
        avatarUrl: "https://bit.ly/code-beast",
        lastMessage: "Hi chao ban",
        lastMessageTime: "2022-01-26T11:41:09Z",
        name: "Tran Cao Phuoc Long",
        unreadMessageCount: 0
    },
    {
        _id: "kjui",
        avatarUrl: "https://bit.ly/code-beast",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://bit.ly/code-beast",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://bit.ly/code-beast",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://bit.ly/code-beast",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://bit.ly/code-beast",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://bit.ly/code-beast",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://bit.ly/code-beast",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://bit.ly/code-beast",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://bit.ly/code-beast",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://bit.ly/code-beast",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    }
    
]
const navigate = useNavigate();
useEffect(()=>{
    const firstConversation = conversations[0];
    navigate(`/message/${firstConversation._id}`)
},[])
  return (
    <Box height="85%" overflow={"auto"}>
        {conversations.map((item, index)=> <Conversation {...item} key={index}/>)}
    </Box>
  )
}