import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  placeOrderRequest,
  placeOrderSuccess,
  placeOrderFailure,
} from '../slices/orderSlice';
import { clearCart } from '../slices/cartSlice';
import { placeOrder } from '@/services/api';
import { Order, CartItem } from '@/types';

interface RootState {
  cart: {
    items: CartItem[];
  };
}

function* placeOrderSaga() {
  try {
    const state: RootState = yield select();
    const { items } = state.cart;
    
    if (items.length === 0) {
      yield put(placeOrderFailure('Cart is empty'));
      return;
    }
    
    const order: Order = yield call(placeOrder, items);
    
    yield put(placeOrderSuccess(order));
    yield put(clearCart());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to place order';
    yield put(placeOrderFailure(message));
  }
}

export function* orderSaga() {
  yield takeLatest(placeOrderRequest.type, placeOrderSaga);
}
