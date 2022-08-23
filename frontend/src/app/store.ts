import { configureStore } from '@reduxjs/toolkit'
import conversationsSlice from './slices/conversations.slice'
import globalSlice from './slices/global.slice'
import messageSlice from './slices/messages.slice'
import userSlice from './slices/user.slice'
import friendsSlice from './slices/friends.slice';

export const store = configureStore({
  reducer: {
    globalSlice: globalSlice,
    conversationsSlice: conversationsSlice,
    userSlice: userSlice,
    messageSlice: messageSlice,
    friendsSlice: friendsSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),

})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch