import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import UserApi from '~/services/apis/User.api'
import { AxiosResponse } from 'axios';
import { IUser } from '~/interfaces/IUser';

export const getMe =  createAsyncThunk("Get me", async ()=>{
  try{
    const response = await UserApi.getMe();
    return response.data;
  } catch(error){
    console.log(error)
    return error;
  }
})
// Define a type for the slice state
interface UserState {
  info:IUser,
  isLoading: boolean,
}

// Define the initial state using that type
const initialState: UserState = {
  info:{
    _id: "",
    name: "",
    username: "",
    avatarUrl: "",
    email: "",
    phone: "",
    birthday: "",
    gender: null
  },
  isLoading: false,
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    
  },
  extraReducers(builder) {
    builder.addCase(getMe.pending, (state: UserState, action: PayloadAction<any>)=>{
      state.isLoading = true;
    })
    builder.addCase(getMe.fulfilled, (state, action: PayloadAction<any>)=>{
      state.info = action.payload.data;
      state.info.avatarUrl = action.payload.data.avatarUrl || "https://picsum.photos/200";
      const birthday = action.payload.data.birthday;
      // if(birthday.includes("-")){
      //   state.info.birthday = {
      //     day: +birthday.split("-")[0],
      //     month: +birthday.split("-")[1],
      //     year: +birthday.split("-")[2],
      //   }
      // }else if (birthday.includes("/")){
      //   state.info.birthday = {
      //     day: +birthday.split("/")[0],
      //     month: +birthday.split("/")[1],
      //     year: +birthday.split("/")[2],
      //   }
      // }
      // else if (birthday.includes(".")){
      //   state.info.birthday = {
      //     day: +birthday.split(".")[0],
      //     month: +birthday.split(".")[1],
      //     year: +birthday.split(".")[2],
      //   }
      // }
      
      state.isLoading = false;
    })
    builder.addCase(getMe.rejected, (state: UserState, action: PayloadAction<any>)=>{
      console.log(action.payload);
      state.isLoading = false;
    })
  },
})

export const {  } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type

export default userSlice.reducer