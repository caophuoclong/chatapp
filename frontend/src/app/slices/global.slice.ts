import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@app/store'
import { Socket } from 'socket.io-client'
export enum ENUM_SCREEN {
  CONVERSATIONS,
  CONTACTS
}


// Define a type for the slice state
interface GlobalState {
    conversation:{
      choosenConversationID: string,
      showInfoConversation: boolean,
    },
    isLargerThanHD: boolean,
    lan: "vn" | "en",
    showScreen: ENUM_SCREEN,
    socket: Socket | null,
    
}

// Define the initial state using that type
const initialState: GlobalState = {
   conversation:{
      choosenConversationID: '',
      showInfoConversation: false,
   },
   lan: "vn",
   isLargerThanHD: false,
   showScreen: ENUM_SCREEN.CONVERSATIONS,
   socket: null,
}

export const global = createSlice({
  name: 'global',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setShowInfoConversation: (state, action: PayloadAction<boolean>) => {
      state.conversation.showInfoConversation = action.payload
    },
    handleChangeLanguage: (state, action: PayloadAction<"en" | "vn">) => {
      state.lan = action.payload
    },
    handleSetLargerThanHD: (state, action: PayloadAction<boolean>) => {
      state.isLargerThanHD = action.payload
    },
    setShowScreen: (state, action: PayloadAction<ENUM_SCREEN>) => {
      state.showScreen = action.payload
    },
    setChoosenConversationID: (state, action: PayloadAction<string>) => {
      state.conversation.choosenConversationID = action.payload
    },
    setSocket: (state, action: PayloadAction<Socket>) => {
      return{
        ...state,
        socket: action.payload
      }
    }
  },
})

export const { setShowInfoConversation, handleChangeLanguage, handleSetLargerThanHD, setShowScreen, setChoosenConversationID, setSocket } = global.actions

// Other code such as selectors can use the imported `RootState` type

export default global.reducer