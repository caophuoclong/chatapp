import {
  createSlice,
  createAsyncThunk,
  PayloadActionCreator,
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@app/store';
import { IMessage, MessageStatusType } from '../../interfaces/IMessage';
import MessagesApi from '../../services/apis/Messages.api';
import Message from '../../components/Main/MessagesBox/Message/index';
import { MAX_TIME_DISTANCE } from '~/configs';

// Define a type for the slice state
// convert two dimensional array to one dimensional array
const convertOneDimensionalArray = (array: Array<Array<IMessage>>) => {
  const result: Array<IMessage> = [];
  array.forEach((group) => {
    group.forEach((message) => {
      result.push(message);
    });
  });
  return result;
};
// const convertTwoDimensionalArray = (array: Array<IMessage>) => {
interface MessageState {
  isLoading: boolean;
  messages: {
    [key: string]: {
      count: number;
      data: Array<Array<IMessage>>;
    };
  };
  value: number;
}
export const sendMessageThunk = createAsyncThunk(
  'send message',
  async (
    { message, updateAt }: { message: IMessage; updateAt: number },
    thunkApi
  ) => {
    console.log(
      '🚀 ~ file: messages.slice.ts:30 ~ thunkApi.getState()',
      thunkApi.getState()
    );
    thunkApi.dispatch(
      addMessage({
        message,
        conversationId: message.destination,
      })
    );
    const response = await MessagesApi.sendMessage({ ...message, updateAt });
    return response.data;
  }
);
export const getMessages = createAsyncThunk(
  'get messages per conversation',
  async ({
    conversationId,
    skip = 0,
  }: {
    conversationId: string;
    skip: number;
  }) => {
    const response = await MessagesApi.getMessages(conversationId, skip);
    response.data.conversationId = conversationId;
    // console.log(response);
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
    initMessage: (state: MessageState, action: PayloadAction<string>) => {
      return {
        ...state,
        messages: {
          [action.payload]: {
            count: 0,
            data: [],
          },
        },
      };
    },
    removeMessageFromMessages: (
      state: MessageState,
      action: PayloadAction<string>
    ) => {
      delete state.messages[action.payload];
      return state;
    },
    addMessage: (
      state: MessageState,
      action: PayloadAction<{
        message: IMessage;
        conversationId: string;
      }>
    ) => {
      const { message, conversationId } = action.payload;
      if (
        !state.messages[conversationId] ||
        state.messages[conversationId].data === null
      ) {
        state.messages = {
          ...state.messages,
          [conversationId]: {
            data: [],
            count: 0,
          },
        };
      }
      const { _id } = message;
      const lastGroup = state.messages[conversationId].data[0]
      if(lastGroup === undefined || lastGroup.length < 1){
        state.messages[conversationId].data.push([message]);
        return state;
      }
      const lastMessage = lastGroup[lastGroup.length - 1];
      const index = lastGroup.findIndex((item: IMessage) => item._id === _id);
      // check if message is already in state
      const messages = convertOneDimensionalArray(state.messages[conversationId].data);
      const isMessageExist = messages.find((item: IMessage) => item._id === _id);
      if (isMessageExist) {
        return state;
      }
      const maxCreatedAt = Math.max(...messages.filter((item: IMessage) => item.sender._id === message.sender._id).map((item: IMessage) => item.createdAt!));
      console.log(maxCreatedAt);
      if (index === -1) {
        if (
          message.sender._id === lastMessage.sender._id &&
          +message.createdAt! - +maxCreatedAt! < MAX_TIME_DISTANCE
        ) {
          lastGroup.push(message);
          state.messages[conversationId].data[0] = lastGroup;
        } else {
          state.messages[conversationId].data.push([message]);
        }
        state.messages[conversationId].count += 1;
      }
    },

    updateSentMessage: (
      state: MessageState,
      action: PayloadAction<{
        tempId: string;
        message: IMessage;
        lastMessage: IMessage;
      }>
    ) => {
      const { message, tempId } = action.payload;
      const { destination: conversationId } = message;
      const x: {
        [key: number]: {
          jndex: number;
          message: IMessage;
        };
      } = {};
      state.messages[conversationId].data.forEach((group, index) =>
        group.forEach((message, jndex) => {
          if (message._id === tempId) {
            x[index] = {
              jndex,
              message,
            };
          }
        })
      );
      state.messages[conversationId].data[+Object.keys(x)[0]][
        x[+Object.keys(x)[0]].jndex
      ] = message;
      return state;
    },
    updateReceivedMessage: (
      state: MessageState,
      action: PayloadAction<{ conversationId: string; messageId: string }>
    ) => {
      const { conversationId, messageId } = action.payload;
      if (state.messages[conversationId]) {
        const x: {
          [key: number]: {
            jndex: number;
            message: IMessage;
          };
        } = {};
        state.messages[conversationId].data.forEach((group, index) =>
          group.forEach((message, jndex) => {
            if (message._id === messageId) {
              x[index] = {
                jndex,
                message,
              };
            }
          })
        );
        state.messages[conversationId].data[+Object.keys(x)[0]][
          x[+Object.keys(x)[0]].jndex
        ] = {
          ...state.messages[conversationId].data[+Object.keys(x)[0]][
            x[+Object.keys(x)[0]].jndex
          ],
          status: MessageStatusType.RECEIVED
        };
        return state;
      }
    },
    updateMessageScale: (
      state: MessageState,
      action: PayloadAction<{
        conversationId: string;
        messageId: string;
      }>
    ) => {
      const { conversationId, messageId } = action.payload;
      const x: {
          [key: number]: {
            jndex: number;
            message: IMessage;
          };
        } = {};
        state.messages[conversationId].data.forEach((group, index) =>
          group.forEach((message, jndex) => {
            if (message._id === messageId) {
              x[index] = {
                jndex,
                message,
              };
            }
          })
        );
        const index = +Object.keys(x)[0];
      if (x[index]) {
        let scale1 = x[index].message.scale || 1;
        scale1 += 0.255555;
        state.messages[conversationId].data[index][
          x[index].jndex
        ] = {
          ...state.messages[conversationId].data[index][
            x[index].jndex
          ],
          scale: scale1
        };
        return state;
      }
    },
    removeMessage: (
      state: MessageState,
      action: PayloadAction<{
        conversationID: string;
        messageID: string;
      }>
    ) => {
      const { conversationID, messageID } = action.payload;
      const x: {
          [key: number]: {
            jndex: number;
            message: IMessage;
          };
        } = {};
        state.messages[conversationID].data.forEach((group, index) =>
          group.forEach((message, jndex) => {
            if (message._id === messageID) {
              x[index] = {
                jndex,
                message,
              };
            }
          })
        );
        console.log(x);
        const index = +Object.keys(x)[0];
      if (x[index]) {
        state.messages[conversationID].data[index].splice(x[index].jndex, 1);
        if(state.messages[conversationID].data[index].length === 0 ){
          state.messages[conversationID].data.splice(index, 1);
        }
        return state;
      }
    },
    recallMessage: (
      state: MessageState,
      action: PayloadAction<{
        conversationId: string;
        messageId: string;
      }>
    ) => {
      const { conversationId, messageId } = action.payload;
      const groupsMessage = state.messages[conversationId].data;
      const x = {} as {
        [key: number]: {
          index: number;
          message: IMessage;
        };
      };
      // find message and group index in groups message
      groupsMessage.forEach((group, index) => {
        group.forEach((message, jndex) => {
          if (message._id === messageId) {
            x[index] = {
              index: jndex,
              message: message,
            };
          }
        });
      });
      const index = +Object.keys(x)[0];
      state.messages[conversationId].data[index][x[index].index] = {
        ...x[index].message,
        isRecall: true,
      };
      // const lastGroup = state.messages[conversationId].data[state.messages[conversationId].data.length - 1];
      // const index = lastGroup.findIndex((message)=>message._id === messageId);
      // const lastMessage = lastGroup[lastGroup.length - 1];
      // if(index >= 0){
      //   let scale1 = lastMessage.scale || 1;
      //   scale1 +=0.255555
      //   state.messages[conversationId].data[state.messages[conversationId].data.length - 1][lastGroup.length - 1] = {
      //     ...lastMessage,
      //     scale: scale1
      //   }
      // return {
      //   ...state,
      //   messages: {
      //     ...state.messages,
      //     [action.payload.conversationId]: {
      //       ...state.messages[action.payload.conversationId],
      //       data: state.messages[action.payload.conversationId].data.map((message)=>{
      //         if(message._id === action.payload.messageId){
      //           return {
      //             ...message,
      //             isRecall: true
      //           }
      //         }
      //         return message;
      //       })
      //     }
      //   }
      // }
    },
  },
  extraReducers(builder) {
    builder.addCase(getMessages.pending, (state: MessageState) => {
      state.isLoading = true;
    });
    builder.addCase(
      getMessages.fulfilled,
      (state: MessageState, action: PayloadAction<any>) => {
        state.isLoading = false;
        const { conversationId, data: messages, count } = action.payload.data;
        if (state.messages[action.payload.data.conversationId] === undefined) {
          state.messages[action.payload.data.conversationId] = {
            data: [],
            count: 0,
          };
        }
        const groupsMessage: Array<Array<IMessage>> = [];
        messages.forEach((message: IMessage) => {
          if (groupsMessage.length === 0) {
            groupsMessage.push([message]);
          } else {
            const lastGroup = groupsMessage[groupsMessage.length - 1];
            const lastMessage = lastGroup[lastGroup.length - 1];
            // is same owner, and distance between 2 message is less than 5 minutes
            if (
              lastMessage.sender._id === message.sender._id &&
              +lastMessage.createdAt! - +message.createdAt! < MAX_TIME_DISTANCE
            ) {
              lastGroup.push(message);
              groupsMessage[groupsMessage.length - 1] = lastGroup;
            } else {
              groupsMessage.push([message]);
            }
          }
        });
        console.log(groupsMessage);
        state.messages[conversationId].data.push(...groupsMessage);
        state.messages[conversationId].count = count;
        // else{
        //   state.messages[action.payload.data.conversationId] = {
        //     data: [...state.messages[action.payload.data.conversationId].data, ...action.payload.data.data],
        //     count: action.payload.data.count,
        //   };
        // }
      }
    );
  },
});

export const {
  addMessage,
  updateSentMessage,
  updateReceivedMessage,
  initMessage,
  updateMessageScale,
  removeMessageFromMessages,
  recallMessage,
  removeMessage,
} = messageSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export default messageSlice.reducer;
