import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@app/store';
import IConversation from '../../interfaces/IConversation';
import FriendsApi from '../../services/apis/Friends.api';
import IFriendShip, { code } from '../../interfaces/IFriendShip';
import { IoTerminal } from 'react-icons/io5';
import { status } from '../../interfaces/IFriendShip';

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
  // friendShips: {
  //   friends: Array<IFriendShip>,
  //   friendsRequest: Array<IFriendShip>,
  // };
  friendShips: Array<IFriendShip>;
  isLoading: boolean;
}

// Define the initial state using that type
const initialState: Friends = {
  // friendShips: {
  //   friends: [],
  //   friendsRequest: [],
  // },
  friendShips: [],
  isLoading: false,
};

export const friendsSlice = createSlice({
  name: 'friends',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addNewFriend: (state: Friends, action: PayloadAction<IFriendShip>) => {
      state.friendShips.push(action.payload);
    },
    changestatus: (
      state: Friends,
      action: PayloadAction<{
        friendShipId: string;
        status: status;
      }>
    ) => {
      state.friendShips.forEach((friendShip) => {
        if (action.payload.friendShipId === friendShip._id) {
          friendShip.status = action.payload.status;
        }
      });
    },
    rejectFriendShip: (state: Friends, action: PayloadAction<string>) => {
      console.log(action.payload);
      const xxx = state.friendShips.filter(
        (friendShip) => friendShip._id !== action.payload
      );
      state.friendShips = xxx;
    },
    changeOnlineStatus: (
      state: Friends,
      action: PayloadAction<{
        _id: string;
        isOnline: boolean;
        lastOnline?: number;
      }>
    ) => {
      state.friendShips.forEach((friendShip) => {
        if (friendShip.user._id === action.payload._id) {
          friendShip.user.isOnline = action.payload.isOnline;
          if (action.payload.lastOnline) {
            friendShip.user.lastOnline = action.payload.lastOnline;
          }
        }
      });
    },
    updateAcceptFriend: (state: Friends, action: PayloadAction<string>) => {
      state.friendShips.forEach((friendShip) => {
        if (friendShip._id === action.payload) {
          friendShip.status = {
            code: 'a',
            name: 'Accept',
          };
        }
      });
    },
  },
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
        const friends = action.payload as Array<IFriendShip>;
        // state.friendShips.friends = friends.filter(friend => friend.status.code === 'a')
        // state.friendShips.friendsRequest = friends.filter(friend => friend.status.code === 'p')
        // (action.payload.data as Array<IFriendShip>).forEach((item)=>{
        //   if(item.status.code === "a"){
        //     state.friendShips.friends.push(item);
        //   }else if (item.status.code === "p"){
        //     state.friendShips.friendsRequest.push(item);
        //   }
        // })
        const x = friends.map((friend) => {
          if (+friend.user.lastOnline === 0 ) {
            return {
              ...friend,
              user: {
                ...friend.user,
                isOnline: true
              }
            };
          }
          return friend;
        });
        state.friendShips = x;
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

export const {
  changestatus,
  rejectFriendShip,
  changeOnlineStatus,
  addNewFriend,
  updateAcceptFriend,
} = friendsSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export default friendsSlice.reducer;
