import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@app/store'
import IConversation from '../../interfaces/IConversation';
import ConversationsApi from '~/services/apis/Conversations.api';

// Define a type for the slice state
export const getMyConversations = createAsyncThunk("Get my conversations",()=>{
    return ConversationsApi.getConversation();
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
    }
    
  },
  extraReducers(builder) {
      builder.addCase(getMyConversations.pending, (state)=>{
        state.isLoading = true;
      })
      builder.addCase(getMyConversations.fulfilled, (state, action)=>{
        state.conversations = action.payload.data.data;
        state.isLoading = false;
      })
  },
})

export const { addConversation } = conversationsSlice.actions

// Other code such as selectors can use the imported `RootState` type

export default conversationsSlice.reducer