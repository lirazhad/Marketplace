export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  brand: string;
  tags: string[];
  createdAt: string;
}

export type ProductCategory =
  | 'Electronics'
  | 'Clothing'
  | 'Furniture';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ProductFilters {
  search: string;
  category: ProductCategory | null;
  sortBy: SortOption;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
}
