import { configureStore } from '@reduxjs/toolkit';
import membershipReducer from './membershipSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['membership']
};

const persistedMembershipReducer = persistReducer(persistConfig, membershipReducer);

export const store = configureStore({
  reducer: {
    membership: persistedMembershipReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store); 