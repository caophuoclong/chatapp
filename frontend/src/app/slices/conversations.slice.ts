import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@app/store'
import IConversation from '../../interfaces/IConversation';
import ConversationsApi from '~/services/apis/Conversations.api';
import { IMessage } from '~/interfaces/IMessage';
import { IEmoji } from '../../interfaces/IConversation';

// Define a type for the slice state
export const getMyConversations = createAsyncThunk("Get my conversations",async ()=>{
  const {data} = await ConversationsApi.getConversations();
    return  data.data;
})
interface Conversations {
    conversations: Array<IConversation>,
    isLoading: boolean,
}

// Define the initial state using that type
const initialState: Conversations = {
    conversations: [],
    isLoading: false
}

export const conversationsSlice = createSlice({
  name: 'conversations',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addConversation: (state: Conversations, action:PayloadAction<IConversation>)=>{
        // check exist conversation
        const existConversation = state.conversations.find(conversation=>{
            return conversation._id === action.payload._id;
        }
        )
        if(existConversation){
            return;
        }
        state.conversations.push(action.payload);
    },
    updateLastestMessage: (state: Conversations, action:PayloadAction<{
      message: IMessage,
      conversationId: string,
    }>)=>{
        const conversation = state.conversations.find(conversation=>{
            return conversation._id === action.payload.conversationId;
        })
        if(conversation){
            conversation.lastMessage = action.payload.message;
        }
    },
    updateLatestUpdateConversation: (state: Conversations, action:PayloadAction<{
      conversationId: string,
      updateAt: number,
      message: IMessage
    }>)=>{
       const conversation = state.conversations.find(conversation=>{
            return conversation._id === action.payload.conversationId;
        })
        if(conversation){
            conversation.updateAt = action.payload.updateAt;
            conversation.lastMessage = action.payload.message;
        }
    },
    updateConversation: (state: Conversations, action:PayloadAction<IConversation>)=>{
        const index = state.conversations.findIndex(conversation=>{
            return conversation._id === action.payload._id;
        })
        if(index !== -1){
            state.conversations[index] = action.payload;
        }
    },
    updateEmoji: (state: Conversations, action:PayloadAction<{_id: string, emoji:IEmoji}>)=>{
        const conversation = state.conversations.find(conversation=>{
            return conversation._id === action.payload._id;
        })
        if(conversation){
            conversation.emoji = action.payload.emoji;
        }
    },
    removeConversation: (state: Conversations, action: PayloadAction<string>)=>{
        const conversations = state.conversations.filter((con)=>con._id !== action.payload)
        return {
            ...state,
            conversations
        };
    }
  },
  extraReducers(builder) {
      builder.addCase(getMyConversations.pending, (state)=>{
        state.isLoading = true;
      })
      builder.addCase(getMyConversations.fulfilled, (state, action)=>{
        state.conversations = action.payload;
        state.isLoading = false;
      })
  },
})

export const { addConversation, updateLastestMessage, updateConversation, updateLatestUpdateConversation,updateEmoji, removeConversation } = conversationsSlice.actions

// Other code such as selectors can use the imported `RootState` type

export default conversationsSlice.reducer