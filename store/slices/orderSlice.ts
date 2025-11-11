import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@/types';

interface OrderState {
  currentOrder: Order | null;
  orderHistory: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  orderHistory: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    placeOrderRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    placeOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.loading = false;
      state.currentOrder = action.payload;
      state.orderHistory.unshift(action.payload);
    },
    placeOrderFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    },
  },
});

export const {
  placeOrderRequest,
  placeOrderSuccess,
  placeOrderFailure,
  clearCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
