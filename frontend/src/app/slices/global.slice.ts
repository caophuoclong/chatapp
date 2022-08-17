import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@app/store'

// Define a type for the slice state
interface GlobalState {
    chossenConversation: string,
}

// Define the initial state using that type
const initialState: GlobalState = {
    chossenConversation: ""
}

export const counterSlice = createSlice({
  name: 'global',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    changeChoosenConversation: (state, action: PayloadAction<string>) => {
        state.chossenConversation = action.payload
    }
  },
})

export const { changeChoosenConversation } = counterSlice.actions

// Other code such as selectors can use the imported `RootState` type

export default counterSlice.reducer