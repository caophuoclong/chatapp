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
type X = { index: number; jndex: number; message: IMessage };
function getIndexAndMessage(
  groupsMessages: Array<Array<IMessage>>,
  temp: string
): X;
function getIndexAndMessage(
  groupsMessages: Array<Array<IMessage>>,
  temp: number
): X;
function getIndexAndMessage(
  groupsMessages: Array<Array<IMessage>>,
  temp: string | number
): X {
  const x: X = {} as X;
  if (typeof temp === 'string') {
    groupsMessages.forEach((group, index) =>
      group.forEach((message, jndex) => {
        if (message._id === temp) {
          x.index = index;
          x.jndex = jndex;
          x.message = message;
        }
      })
    );
  }
  if (typeof temp === 'number') {
    groupsMessages.forEach((group, index) =>
      group.forEach((message, jndex) => {
        if (+(message.createdAt || 0) === temp) {
          x.index = index;
          x.jndex = jndex;
          x.message = message;
        }
      })
    );
  }
  return x;
}
// check is the same sender
const isSameSender = (message: IMessage, temp: IMessage) => {
  return message.sender._id === temp.sender._id;
};
const getMaxCreatedAt = (messages: IMessage[]) => {
  return Math.max(...messages.map((item: IMessage) => item.createdAt!));
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
  progressUploadFile: {
    [key: string]: number;
  }
  value: number;
}
export const sendMessageThunk = createAsyncThunk(
  'send message',
  async (
    { message, updateAt }: { message: IMessage; updateAt: number },
    thunkApi
  ) => {
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
  progressUploadFile: {},
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
      const messagesGroups = state.messages[conversationId].data;
      // check if message is already in state
      const messages = convertOneDimensionalArray(
        state.messages[conversationId].data
      );
      const isMessageExist = messages.find(
        (item: IMessage) => item._id === _id
      );
      if (isMessageExist) {
        return state;
      }
      const maxCreatedAt = getMaxCreatedAt(messages);
      const indexMessage = getIndexAndMessage(messagesGroups, maxCreatedAt);
      console.log(indexMessage);
      if (indexMessage.index === undefined) {
        state.messages[conversationId].data.push([message]);
        state.messages[conversationId].count += 1;
        return state;
      }
      if (
        +message.createdAt! - +maxCreatedAt! < MAX_TIME_DISTANCE &&
        isSameSender(indexMessage.message, message)
      ) {
        const lastGroup = [
          ...state.messages[conversationId].data[indexMessage.index],
        ];
        lastGroup.push(message);
        state.messages[conversationId].data[indexMessage.index] = lastGroup;
      } else {
        state.messages[conversationId].data.push([message]);
      }
      state.messages[conversationId].count += 1;
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
      const indexAndMessage = getIndexAndMessage(
        state.messages[conversationId].data,
        tempId
      );
      state.messages[conversationId].data[indexAndMessage.index][
        indexAndMessage.jndex
      ] = message;
      return state;
    },
    updateReceivedMessage: (
      state: MessageState,
      action: PayloadAction<{ conversationId: string; messageId: string }>
    ) => {
      const { conversationId, messageId } = action.payload;

      if (state.messages[conversationId]) {
        const indexAndMessage = getIndexAndMessage(
          state.messages[conversationId].data,
          messageId
        );
        state.messages[conversationId].data[indexAndMessage.index][
          indexAndMessage.jndex
        ] = {
          ...state.messages[conversationId].data[indexAndMessage.index][
            indexAndMessage.jndex
          ],
          status: MessageStatusType.RECEIVED,
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
      const indexAndMessage = getIndexAndMessage(
        state.messages[conversationId].data,
        messageId
      );
      if (indexAndMessage.jndex) {
        let scale1 = indexAndMessage.message.scale || 1;
        scale1 += 0.255555;
        state.messages[conversationId].data[indexAndMessage.index][
          indexAndMessage.jndex
        ] = {
          ...state.messages[conversationId].data[indexAndMessage.index][
            indexAndMessage.jndex
          ],
          scale: scale1,
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
      const indexAndMessage = getIndexAndMessage(
        state.messages[conversationID].data,
        messageID
      );
      if (state.messages[conversationID].data[indexAndMessage.index]) {
        const xxx = [
          ...state.messages[conversationID].data[indexAndMessage.index],
        ];
        xxx.splice(indexAndMessage.jndex, 1);
        state.messages[conversationID].data[indexAndMessage.index] = xxx;
        if (
          state.messages[conversationID].data[indexAndMessage.index].length ===
          0
        ) {
          state.messages[conversationID].data.splice(indexAndMessage.index, 1);
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
      const indexAndMessage = getIndexAndMessage(
        state.messages[conversationId].data,
        messageId
      );
      state.messages[conversationId].data[indexAndMessage.index][
        indexAndMessage.jndex
      ] = {
        ...indexAndMessage.message,
        isRecall: true,
      };
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
        state.messages[conversationId].data.push(...groupsMessage);
        state.messages[conversationId].count = count;
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
