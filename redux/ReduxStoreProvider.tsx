"use client";

import { AppStore, makeStore } from "@/redux/store";
import { useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

export default function ReduxStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize store ONCE using lazy initializer
  const [storeData] = useState(() => {
    const store: AppStore = makeStore();
    const persistor = persistStore(store);
    return { store, persistor };
  });

  return (
    <Provider store={storeData.store}>
      <PersistGate loading={null} persistor={storeData.persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
