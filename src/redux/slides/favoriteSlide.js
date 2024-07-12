import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favoriteItems: [],
  isSuccess: false,
  isError: false,
};

export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    addFavoriteProduct: (state, action) => {
      const { favoriteItem } = action.payload;
      const itemFavorite = state.favoriteItems.find((item) => item.product === favoriteItem.product);
      if (!itemFavorite) {
        state.favoriteItems.push(favoriteItem);
        state.isSuccess = true;
        state.isError = false;
      } else {
        state.isError = true;
      }
    },
    removeFavoriteProduct: (state, action) => {
      const { idProduct } = action.payload;
      state.favoriteItems = state.favoriteItems.filter((item) => item.product !== idProduct);
      state.isSuccess = true;
      state.isError = false;
    },
    resetFavorite: (state) => {
      state.isSuccess = false;
      state.isError = false;
    },
  },
});

export const { addFavoriteProduct, removeFavoriteProduct, resetFavorite } = favoriteSlice.actions;

export default favoriteSlice.reducer;