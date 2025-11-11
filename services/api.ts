import {
  Product,
  ProductListResponse,
  ProductFilters,
  PaginationParams,
  Order,
  CartItem,
  ProductCategory,
  SortOption,
} from '@/types';
import { mockProducts } from '@/mocks/products';

const API_DELAY = 800;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function filterProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  let filtered = [...products];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower) ||
        p.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  if (filters.category) {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  return filtered;
}

function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    default:
      return sorted;
  }
}

export async function fetchProducts(
  filters: ProductFilters,
  pagination: PaginationParams
): Promise<ProductListResponse> {
  await delay(API_DELAY);

  const filtered = filterProducts(mockProducts, filters);
  const sorted = sortProducts(filtered, filters.sortBy);

  const start = (pagination.page - 1) * pagination.limit;
  const end = start + pagination.limit;
  const paginatedProducts = sorted.slice(start, end);

  return {
    products: paginatedProducts,
    total: sorted.length,
    page: pagination.page,
    limit: pagination.limit,
    hasMore: end < sorted.length,
  };
}

export async function fetchProductById(id: string): Promise<Product | null> {
  await delay(API_DELAY);

  const product = mockProducts.find((p) => p.id === id);
  return product || null;
}

export async function fetchCategories(): Promise<ProductCategory[]> {
  await delay(300);

  return [
    'Electronics',
    'Clothing',
    'Furniture',
  ];
}

export async function placeOrder(items: CartItem[]): Promise<Order> {
  await delay(1500);

  if (items.length === 0) {
    throw new Error('Cart is empty');
  }

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const order: Order = {
    id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    items,
    totalPrice: Math.round(totalPrice * 100) / 100,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  return order;
}
