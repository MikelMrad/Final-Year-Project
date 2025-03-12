import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  product: string;
}

const initialState: FilterState = {
  product: "",
};

const filterSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setFilterProduct: (state, action: PayloadAction<string>) => {
      state.product = action.payload;
    },
  },
});

export const { setFilterProduct } = filterSlice.actions;
export default filterSlice.reducer;
