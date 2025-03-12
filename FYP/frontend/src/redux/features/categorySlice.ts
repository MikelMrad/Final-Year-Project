import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  category: string;
}

const initialState: FilterState = {
  category: "",
};

const filterSlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setFilterCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    clearFilterCategory: (state) => {
      state.category = " ";
    },
  },
});

export const { setFilterCategory, clearFilterCategory } = filterSlice.actions;
export default filterSlice.reducer;
