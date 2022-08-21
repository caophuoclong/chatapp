import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@app/store'

// Define a type for the slice state
interface MessageState {
  value: number
}

// Define the initial state using that type
const initialState: MessageState = {
  value: 0,
}

export const messageSlice = createSlice({
  name: 'message',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    
  },
})

export const {  } = messageSlice.actions

// Other code such as selectors can use the imported `RootState` type

export default messageSlice.reducer