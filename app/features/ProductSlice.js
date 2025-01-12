import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  currentProduct: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProduct: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const { productId, updatedData } = action.payload;
      const product = state.products.find((prod) => prod.id === productId);
      if (product) {
        Object.assign(product, updatedData);
      }
    },
    deleteProduct: (state, action) => {
      const { productId } = action.payload;
      state.products = state.products.filter((prod) => prod.id !== productId);
    },
    clearProducts: (state) => {
      state.products = []; 
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null; 
    },
  },
});

export const {
  setProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  clearProducts,
  setCurrentProduct,
  clearCurrentProduct,
} = productSlice.actions;

export default productSlice.reducer;
