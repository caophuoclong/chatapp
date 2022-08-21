import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface UserState {
  info:{
    displayName: string
    username: string,
    avatarUrl: string,
    email: string,
    phone: string,
    birthday: {
        day: number,
        month: number,
        year: number
    },
  },
  isLoading: boolean,
}

// Define the initial state using that type
const initialState: UserState = {
  info:{
    displayName: "",
    username: "",
    avatarUrl: "",
    email: "",
    phone: "",
    birthday: {
        day: 0,
        month: 0,
        year: 0
    },
  },
  isLoading: false,
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    
  },
})

export const {  } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type

export default userSlice.reducer