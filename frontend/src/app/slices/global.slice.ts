import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@app/store'

// Define a type for the slice state
interface GlobalState {
    conversation:{
      choosenConversation: string,
      showInfoConversation: boolean,
    
    },
    lan: "vn" | "en",
    
}

// Define the initial state using that type
const initialState: GlobalState = {
   conversation:{
      choosenConversation: '',
      showInfoConversation: false,
   },
   lan: "vn"
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
    }
  },
})

export const { setShowInfoConversation, handleChangeLanguage } = global.actions

// Other code such as selectors can use the imported `RootState` type

export default global.reducer