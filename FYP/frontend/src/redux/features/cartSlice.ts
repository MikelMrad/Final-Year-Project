import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string,
  availableQuantity:number,
  quantity: number , //quantity available in cart
  image: string,
  name: string,
  price: number,
}

interface CartState {
  items: CartItem[],
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        if(existingItem.quantity >= existingItem.availableQuantity){
          alert("Maximum Amount Reached")
        }
        else {
          existingItem.quantity += action.payload.quantity;
        }
      } 
      else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
