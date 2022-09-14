import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@app/store'
import { Socket } from 'socket.io-client'
import Auth from '~/services/apis/Auth.api'
import { ILoginRequest } from '~/interfaces/ILogin';
import { IRegisterRequest } from '~/interfaces/IRegister';
export enum ENUM_SCREEN {
  CONVERSATIONS,
  CONTACTS
}

export const login =  createAsyncThunk("login", async (data: ILoginRequest)=>{
  return await Auth.login(data);
})
export const register = createAsyncThunk("register", async (data: IRegisterRequest)=>{
  return await Auth.register(data);
})
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
    loading: {
      login: boolean
    }
    
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
   loading:{
    login: false,
   }
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
  extraReducers:builder => {
    builder.addCase(login.pending, (state, action) => {
      state.loading.login = true
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading.login = false
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading.login = false
    })
    builder.addCase(register.pending, (state, action) => {
      state.loading.login = true
    }
    )
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading.login = false
    }
    )
    builder.addCase(register.rejected, (state, action) => {
      state.loading.login = false
    }
    )

  }
})

export const { setShowInfoConversation, handleChangeLanguage, handleSetLargerThanHD, setShowScreen, setChoosenConversationID, setSocket } = global.actions

// Other code such as selectors can use the imported `RootState` type

export default global.reducer