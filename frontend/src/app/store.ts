import { configureStore } from '@reduxjs/toolkit'
import conversationsSlice from './slices/conversations.slice'
import globalSlice from './slices/global.slice'

export const store = configureStore({
  reducer: {
    globalSlice: globalSlice,
    conversationsSlice: conversationsSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch