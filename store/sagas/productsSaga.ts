import { call, put, select, takeLatest, debounce } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductByIdRequest,
  fetchProductByIdSuccess,
  fetchProductByIdFailure,
  setSearchQuery,
  setCategory,
  setSortBy,
} from '../slices/productsSlice';
import { fetchProducts, fetchProductById } from '@/services/api';
import { ProductListResponse, Product } from '@/types';
import type { RootState } from '../index';

function* fetchProductsSaga(action: PayloadAction<{ loadMore?: boolean }>) {
  try {
    const state: RootState = yield select();
    const { filters, pagination } = state.products;
    
    const page = action.payload.loadMore ? pagination.page + 1 : 1;
    
    const response: ProductListResponse = yield call(
      fetchProducts,
      filters,
      { page, limit: pagination.limit }
    );
    
    yield put(fetchProductsSuccess(response));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch products';
    yield put(fetchProductsFailure(message));
  }
}

function* fetchProductByIdSaga(action: PayloadAction<string>) {
  try {
    const product: Product | null = yield call(fetchProductById, action.payload);
    
    if (product) {
      yield put(fetchProductByIdSuccess(product));
    } else {
      yield put(fetchProductByIdFailure('Product not found'));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch product';
    yield put(fetchProductByIdFailure(message));
  }
}

function* handleFilterChange() {
  yield put(fetchProductsRequest({ loadMore: false }));
}

export function* productsSaga() {
  yield takeLatest(fetchProductsRequest.type, fetchProductsSaga);
  yield takeLatest(fetchProductByIdRequest.type, fetchProductByIdSaga);
  yield debounce(500, setSearchQuery.type, handleFilterChange);
  yield takeLatest(setCategory.type, handleFilterChange);
  yield takeLatest(setSortBy.type, handleFilterChange);
}
