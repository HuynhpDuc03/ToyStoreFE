import { combineReducers, configureStore } from '@reduxjs/toolkit'
import productReducer from './slides/productSlide'
import userReducer from '../../src/redux/userSlide'
import orderReducer from './slides/orderSlide'
import favoriteReducer from './slides/favoriteSlide'; 

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
  import storage from 'redux-persist/lib/storage'

  const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist:['product','user'],
  }

const rootReducer = combineReducers({
    user: userReducer,
    product: productReducer,
    order:orderReducer,
    favorite: favoriteReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)



export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
})

export let persistor = persistStore(store)