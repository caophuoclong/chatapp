import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@app/store';
import IConversation from '../../interfaces/IConversation';
import FriendsApi from '../../services/apis/Friends.api';
import IFriendShip from '../../interfaces/IFriendShip';

export const getFriendsList = createAsyncThunk('get friends list', async () => {
  try {
    const response = await FriendsApi.getFriends();
    return response.data;
  } catch (error) {
    return error;
  }
});
// Define a type for the slice state
interface Friends {
  friends: Array<IFriendShip>;
  isLoading: boolean;
}

// Define the initial state using that type
const initialState: Friends = {
  friends: [],
  isLoading: false,
};

export const friendsSlice = createSlice({
  name: 'friends',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      getFriendsList.pending,
      (state: Friends, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      getFriendsList.fulfilled,
      (state: Friends, action: PayloadAction<any>) => {
        state.isLoading = false;
        console.log(action.payload.data)
        state.friends = action.payload.data;
      }
    );
    builder.addCase(
      getFriendsList.rejected,
      (state: Friends, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );
  },
});

export const {} = friendsSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export default friendsSlice.reducer;
