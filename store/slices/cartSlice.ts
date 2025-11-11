import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

function calculateTotals(items: CartItem[]): Pick<CartState, 'totalItems' | 'totalPrice'> {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  return {
    totalItems,
    totalPrice: Math.round(totalPrice * 100) / 100,
  };
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      
      if (quantity <= 0) {
        return;
      }
      
      if (quantity > product.stock) {
        return;
      }
      
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      );
      
      if (existingItemIndex !== -1) {
        const existingItem = state.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        if (newQuantity > product.stock) {
          state.items[existingItemIndex].quantity = product.stock;
        } else {
          state.items[existingItemIndex].quantity = newQuantity;
        }
      } else {
        state.items.push({
          product,
          quantity: Math.min(quantity, product.stock),
        });
      }
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product.id !== productId);
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
    
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.product.id !== productId);
      } else {
        const itemIndex = state.items.findIndex(
          (item) => item.product.id === productId
        );
        
        if (itemIndex !== -1) {
          const item = state.items[itemIndex];
          const maxQuantity = item.product.stock;
          state.items[itemIndex].quantity = Math.min(quantity, maxQuantity);
        }
      }
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
