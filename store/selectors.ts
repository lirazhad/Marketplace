import { createSelector } from 'reselect';
import type { RootState } from './index';

export const selectProductsState = (state: RootState) => state.products;
export const selectCartState = (state: RootState) => state.cart;
export const selectOrderState = (state: RootState) => state.order;

export const selectProducts = createSelector(
  [selectProductsState],
  (products) => products.items
);

export const selectProductsLoading = createSelector(
  [selectProductsState],
  (products) => products.loading
);

export const selectProductsError = createSelector(
  [selectProductsState],
  (products) => products.error
);

export const selectCurrentProduct = createSelector(
  [selectProductsState],
  (products) => products.currentProduct
);

export const selectProductLoading = createSelector(
  [selectProductsState],
  (products) => products.loadingProduct
);

export const selectFilters = createSelector(
  [selectProductsState],
  (products) => products.filters
);

export const selectPagination = createSelector(
  [selectProductsState],
  (products) => products.pagination
);

export const selectHasMore = createSelector(
  [selectPagination],
  (pagination) => pagination.hasMore
);

export const selectCartItems = createSelector(
  [selectCartState],
  (cart) => cart.items
);

export const selectCartTotalItems = createSelector(
  [selectCartState],
  (cart) => cart.totalItems
);

export const selectCartTotalPrice = createSelector(
  [selectCartState],
  (cart) => cart.totalPrice
);

export const selectCartItemByProductId = (productId: string) =>
  createSelector([selectCartItems], (items) =>
    items.find((item) => item.product.id === productId)
  );

export const selectIsProductInCart = (productId: string) =>
  createSelector(
    [selectCartItems],
    (items) => items.some((item) => item.product.id === productId)
  );

export const selectCurrentOrder = createSelector(
  [selectOrderState],
  (order) => order.currentOrder
);

export const selectOrderLoading = createSelector(
  [selectOrderState],
  (order) => order.loading
);

export const selectOrderError = createSelector(
  [selectOrderState],
  (order) => order.error
);

export const selectOrderHistory = createSelector(
  [selectOrderState],
  (order) => order.orderHistory
);
