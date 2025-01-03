import { configureStore, Middleware, Reducer } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import React, { PropsWithChildren } from 'react';

interface ApiStore {
  reducerPath: string;
  reducer: Reducer;
  middleware: Middleware;
}

export function setupApiStore(api: ApiStore) {
  const store = configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: (gdm) =>
      gdm({ serializableCheck: false, immutableCheck: false }).concat(
        api.middleware
      ),
  });

  const Wrapper: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return React.createElement(Provider, { store }, children);
  };

  return {
    store,
    Wrapper
  };
}