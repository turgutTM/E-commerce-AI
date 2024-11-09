import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "@/app/features/UserSlice";
import productReducer from "@/app/features/ProductSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedProductReducer = persistReducer(persistConfig, productReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    product: persistedProductReducer,
  },
});

export const persistor = persistStore(store);
