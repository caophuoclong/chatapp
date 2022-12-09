import { Reducer, useReducer } from 'react';

enum EmojiReducerType {
  SET_TIME,
  SET_STATE,
  SET_MESSAGE_ID,
  SET_CONTENT,
  SET_SCALE,
  SET_DEFAULT,
  SET_INTERVAL,
  CLEAR_INTERVAL,
}
export interface IinitialEmojiState {
  messageId: string;
  time: number;
  scale: number;
  state: 'up' | 'down' | '';
  content: string;
  interval: false | NodeJS.Timer;
}
export const initialEmojiState: IinitialEmojiState = {
  messageId: '',
  time: 0,
  scale: 1,
  state: '',
  content: '',
  interval: false,
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
  console.log(payload);
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
      return {
        messageId: '',
        time: 0,
        scale: 1,
        state: '',
        content: '',
        interval: false,
      };
    }
    case EmojiReducerType.SET_INTERVAL: {
      return {
        ...state,
        interval: payload,
      };
    }
    case EmojiReducerType.CLEAR_INTERVAL: {
      clearInterval(state.interval as NodeJS.Timer);
      return {
        ...state,
        interval: false,
      };
    }
    default:
      return state;
  }
};
function setEmojiInterval(interval: false | NodeJS.Timer): EmojiAction {
  return {
    type: EmojiReducerType.SET_INTERVAL,
    payload: interval,
  };
}
function clearEmojiInterval(): EmojiAction {
  return {
    type: EmojiReducerType.CLEAR_INTERVAL,
  };
}
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
  setEmojiInterval,
  clearEmojiInterval,
};
