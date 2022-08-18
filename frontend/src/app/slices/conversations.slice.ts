import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@app/store'
import IConversation from '../../interfaces/IConversation';

// Define a type for the slice state
interface Conversations {
    conversations: Array<IConversation>
}

// Define the initial state using that type
const initialState: Conversations = {
    conversations: [{
        _id: "ksf",
        avatarUrl: "https://picsum.photos/128",
        lastMessage: "Hi chao ban",
        lastMessageTime: "2022-01-26T11:41:09Z",
        name: "Tran Cao Phuoc Long",
        unreadMessageCount: 0
    },
    {
        _id: "kjui",
        avatarUrl: "https://picsum.photos/128",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://picsum.photos/128",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://picsum.photos/128",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://picsum.photos/128",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://picsum.photos/128",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://picsum.photos/128",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://picsum.photos/128",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://picsum.photos/128",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://picsum.photos/128",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    },{
        _id: "kjui",
        avatarUrl: "https://picsum.photos/128",
        lastMessage: "Xin chao ban hien",
        lastMessageTime: "2022-02-19T11:18:49Z",
        name: "Cristiano",
        unreadMessageCount: 0
    }]
}

export const conversationsSlice = createSlice({
  name: 'conversations',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    
  },
})

export const {  } = conversationsSlice.actions

// Other code such as selectors can use the imported `RootState` type

export default conversationsSlice.reducer