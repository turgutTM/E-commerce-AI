import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "@/app/features/UserSlice";
import productReducer from "@/app/features/ProductSlice";
import ShopCartReducer from "@/app/features/ShopCart";

const userPersistConfig = {
  key: "user",
  storage,
};

const productPersistConfig = {
  key: "product",
  storage,
};

const shopCartPersistConfig = {
  key: "shopCart",
  storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedProductReducer = persistReducer(
  productPersistConfig,
  productReducer
);
const persistedShopCartReducer = persistReducer(
  shopCartPersistConfig,
  ShopCartReducer
);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    product: persistedProductReducer,
    ShopCart: persistedShopCartReducer,
  },
});

export const persistor = persistStore(store);
