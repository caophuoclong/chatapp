import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@app/store';
import { IMessage, MessageStatusType } from '../../interfaces/IMessage';
import MessagesApi from '../../services/apis/Messages.api';
import Message from '../../components/Main/MessagesBox/Message/index';

// Define a type for the slice state
interface MessageState {
  isLoading: boolean;
  messages: {
    [key: string]: {
      count: number;
      data: Array<IMessage>;
    };
  };
  value: number;
}
export const getMessages = createAsyncThunk(
  'get messages per conversation',
  async ({
    conversationId,
    skip = 0,
  }:{
    conversationId: string,
    skip: number,
  }) => {
    const response = await MessagesApi.getMessages(conversationId, skip);
    response.data.conversationId = conversationId;
    console.log(response);
    return response;
  }
);
// Define the initial state using that type
const initialState: MessageState = {
  isLoading: false,
  value: 0,
  messages: {},
};

export const messageSlice = createSlice({
  name: 'message',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    initMessage: (state: MessageState, action: PayloadAction<string>)=>{
      return {
        ...state,
        messages: {
          [action.payload] : {
            count: 0,
            data: []
          }
        }
      }
    },
    addMessage:(state: MessageState, action: PayloadAction<{
      message: IMessage,
      conversationId: string,
    }>) =>{
      const { message, conversationId } = action.payload;
      if(!state.messages[conversationId]){
        state.messages[conversationId].data = [];
      }else{
        const {_id} = message;
        const index = state.messages[conversationId].data.findIndex((item: IMessage) => item._id === _id);
        if(index === -1){
          state.messages[conversationId].data.push(message);
          state.messages[conversationId].count += 1;
        }
      }
    },
    updateSentMessage: (state: MessageState, action: PayloadAction<{
      conversationId: string,
      tempId: string,
      value: Partial<IMessage>
    }>)=>{
      const { conversationId, value, tempId } = action.payload;
      console.log(conversationId);
      const index = state.messages[conversationId].data.findIndex((message)=>message._id === tempId);
      console.log(index);
      state.messages[conversationId].data[index] = {
        ...state.messages[conversationId].data[index],
        ...value
      }
    },
    updateReceivedMessage: (state: MessageState, action: PayloadAction<{conversationId: string, messageId: string}>)=>{
      const {conversationId, messageId} = action.payload;
      if(state.messages[conversationId]){
        const index = state.messages[conversationId].data.findIndex((message)=>message._id === messageId);
      state.messages[conversationId].data[index] = {
        ...state.messages[conversationId].data[index],
        status: MessageStatusType.RECEIVED
      }
      }
      
    }

  },
  extraReducers(builder) {
    builder.addCase(getMessages.pending,  (state: MessageState)=>{
      state.isLoading = true;
    })
    builder.addCase(getMessages.fulfilled, (state: MessageState, action: PayloadAction<any>)=>{

      state.isLoading = false;
      console.log(state.messages[action.payload.data.conversationId]);
      if(state.messages[action.payload.data.conversationId] === undefined){
      state.messages[action.payload.data.conversationId] = {
        data: [],
        count: 0,
      };
      state.messages[action.payload.data.conversationId].data = action.payload.data.data;
      state.messages[action.payload.data.conversationId].count = action.payload.data.count;
    }
    else{
      state.messages[action.payload.data.conversationId] = {
        data: [...state.messages[action.payload.data.conversationId].data, ...action.payload.data.data],
        count: action.payload.data.count,
      };
    }
    })
  },
});

export const {addMessage, updateSentMessage, updateReceivedMessage, initMessage} = messageSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export default messageSlice.reducer;
