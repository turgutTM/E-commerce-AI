import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

const shopCartSlice = createSlice({
  name: "shopCart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.cartItems.find(
        (item) => item._id === product._id
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.cartItems.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== productId
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setCartItems } =
  shopCartSlice.actions;
export default shopCartSlice.reducer;
