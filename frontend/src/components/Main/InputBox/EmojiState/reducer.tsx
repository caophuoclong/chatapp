import { Reducer, useReducer } from 'react';

enum EmojiReducerType {
  SET_TIME,
  SET_STATE,
  SET_MESSAGE_ID,
  SET_CONTENT,
  SET_SCALE,
  SET_DEFAULT,
}
export interface IinitialEmojiState {
  messageId: string;
  time: number;
  scale: number;
  state: 'up' | 'down' | '';
  content: string;
}
export const initialEmojiState: IinitialEmojiState = {
  messageId: '',
  time: 0,
  scale: 1,
  state: '',
  content: '',
};
export interface EmojiAction {
  type: EmojiReducerType;
  payload?: any;
}
export const EmojiReducer: Reducer<IinitialEmojiState, EmojiAction> = (
  state: IinitialEmojiState,
  action: EmojiAction
): IinitialEmojiState => {
  const { type, payload } = action;
  switch (type) {
    case EmojiReducerType.SET_TIME: {
      return {
        ...state,
        time: payload,
      };
    }
    case EmojiReducerType.SET_CONTENT: {
      return {
        ...state,
        content: payload,
      };
    }
    case EmojiReducerType.SET_STATE: {
      return {
        ...state,
        state: payload,
      };
    }
    case EmojiReducerType.SET_MESSAGE_ID: {
      return {
        ...state,
        messageId: payload,
      };
    }
    case EmojiReducerType.SET_SCALE: {
      return {
        ...state,
        scale: payload,
      };
    }
    case EmojiReducerType.SET_DEFAULT: {
      return initialEmojiState;
    }
    default:
      return state;
  }
};

function setTime(payload: any): EmojiAction {
  return {
    type: EmojiReducerType.SET_TIME,
    payload,
  };
}
function setState(payload: 'up' | 'down' | ''): EmojiAction {
  return {
    type: EmojiReducerType.SET_STATE,
    payload,
  };
}
function setMessageId(payload: string): EmojiAction {
  return {
    type: EmojiReducerType.SET_MESSAGE_ID,
    payload,
  };
}
function setEmojiContent(payload: string): EmojiAction {
  return {
    type: EmojiReducerType.SET_CONTENT,
    payload,
  };
}
function setScale(payload: number): EmojiAction {
  return {
    type: EmojiReducerType.SET_SCALE,
    payload,
  };
}
function setDefault(): Pick<EmojiAction, 'type'> {
  return {
    type: EmojiReducerType.SET_DEFAULT,
  };
}

export {
  setTime,
  setScale,
  setEmojiContent,
  setState,
  setMessageId,
  setDefault,
};
