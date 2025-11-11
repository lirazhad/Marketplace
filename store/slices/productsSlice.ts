import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductFilters, ProductListResponse, SortOption, ProductCategory } from '@/types';

interface ProductsState {
  items: Product[];
  currentProduct: Product | null;
  filters: ProductFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  loading: boolean;
  error: string | null;
  loadingProduct: boolean;
  productError: string | null;
}

const initialState: ProductsState = {
  items: [],
  currentProduct: null,
  filters: {
    search: '',
    category: null,
    sortBy: 'newest' as SortOption,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: true,
  },
  loading: false,
  error: null,
  loadingProduct: false,
  productError: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsRequest: (state, action: PayloadAction<{ loadMore?: boolean }>) => {
      state.loading = true;
      state.error = null;
      
      if (!action.payload.loadMore) {
        state.items = [];
        state.pagination.page = 1;
      }
    },
    fetchProductsSuccess: (state, action: PayloadAction<ProductListResponse>) => {
      state.loading = false;
      
      if (action.payload.page === 1) {
        state.items = action.payload.products;
      } else {
        state.items = [...state.items, ...action.payload.products];
      }
      
      state.pagination = {
        page: action.payload.page,
        limit: action.payload.limit,
        total: action.payload.total,
        hasMore: action.payload.hasMore,
      };
    },
    fetchProductsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    fetchProductByIdRequest: (state, action: PayloadAction<string>) => {
      state.loadingProduct = true;
      state.productError = null;
      state.currentProduct = null;
    },
    fetchProductByIdSuccess: (state, action: PayloadAction<Product>) => {
      state.loadingProduct = false;
      state.currentProduct = action.payload;
    },
    fetchProductByIdFailure: (state, action: PayloadAction<string>) => {
      state.loadingProduct = false;
      state.productError = action.payload;
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setCategory: (state, action: PayloadAction<ProductCategory | null>) => {
      state.filters.category = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.filters.sortBy = action.payload;
    },
    
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.items = [];
      state.pagination = initialState.pagination;
    },
    
    loadMoreProducts: (state) => {
      if (state.pagination.hasMore && !state.loading) {
        state.pagination.page += 1;
      }
    },
  },
});

export const {
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductByIdRequest,
  fetchProductByIdSuccess,
  fetchProductByIdFailure,
  setSearchQuery,
  setCategory,
  setSortBy,
  resetFilters,
  loadMoreProducts,
} = productsSlice.actions;

export default productsSlice.reducer;
