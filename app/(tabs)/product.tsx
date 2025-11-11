import { CartBadge } from '@/components/CartBadge';
import { EmptyState } from '@/components/EmptyState';
import { FilterChips } from '@/components/FilterChips';
import { useGlobalBottomSheet } from '@/components/GlobalBottomSheetProvider';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
  selectCartTotalItems,
  selectFilters,
  selectHasMore,
  selectProducts,
  selectProductsError,
  selectProductsLoading,
} from '@/store/selectors';
import {
  fetchProductsRequest,
  setCategory,
  setSearchQuery,
  setSortBy,
// eslint-disable-next-line import/no-unresolved
} from '@/store/slices/productsSlice';
import { theme } from '@/theme';
import { ProductCategory, SortOption } from '@/types';
import { Stack, useRouter } from 'expo-router';
import { AlertCircle, ArrowUpDown } from 'lucide-react-native';
import React, { useCallback, useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import styled from 'styled-components/native';


const Container = styled(View)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Header = styled(View)`
  padding: ${theme.spacing.md}px;
  padding-top: ${theme.spacing.sm}px;
  gap: ${theme.spacing.md}px;
  background-color: ${theme.colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

const SortButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md}px;
  border: 1px solid ${theme.colors.border};
  gap: ${theme.spacing.xs}px;
`;

const SortText = styled(Text)`
  font-size: ${theme.fontSize.sm}px;
  color: ${theme.colors.text};
  font-weight: ${theme.fontWeight.medium};
`;

const ListContainer = styled(View)`
  flex: 1;
  padding: ${theme.spacing.md}px;
`;

const LoadMoreContainer = styled(View)`
  padding: ${theme.spacing.lg}px;
  align-items: center;
`;

const ErrorContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xl}px;
`;

const ErrorText = styled(Text)`
  font-size: ${theme.fontSize.md}px;
  color: ${theme.colors.error};
  text-align: center;
  margin-top: ${theme.spacing.md}px;
`;

const ModalContent = styled(View)`
  background-color: ${theme.colors.white};
  border-top-left-radius: ${theme.borderRadius.xl}px;
  border-top-right-radius: ${theme.borderRadius.xl}px;
  padding: ${theme.spacing.lg}px;
`;

const ModalTitle = styled(Text)`
  font-size: ${theme.fontSize.lg}px;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md}px;
`;

const SortOptionButton = styled.TouchableOpacity<{ selected: boolean }>`
  padding: ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.md}px;
  background-color: ${({ selected }) =>
    selected ? theme.colors.primary : 'transparent'};
  margin-bottom: ${theme.spacing.sm}px;
`;

const SortOptionText = styled(Text)<{ selected: boolean }>`
  font-size: ${theme.fontSize.md}px;
  color: ${({ selected }) =>
    selected ? theme.colors.white : theme.colors.text};
  font-weight: ${({ selected }) =>
    selected ? theme.fontWeight.semibold : theme.fontWeight.regular};
`;

const categories: ProductCategory[] = [
  'Electronics',
  'Clothing',
  'Furniture',
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function ProductsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showBottomSheet, hideBottomSheet } = useGlobalBottomSheet();

  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const filters = useAppSelector(selectFilters);
  const hasMore = useAppSelector(selectHasMore);
  const cartItemsCount = useAppSelector(selectCartTotalItems);

  useEffect(() => {
    dispatch(fetchProductsRequest({ loadMore: false }));
  }, []);

  const handleSearch = useCallback(
    (text: string) => {
      dispatch(setSearchQuery(text));
    },
    [dispatch]
  );

  const handleCategoryChange = useCallback(
    (category: ProductCategory | null) => {
      dispatch(setCategory(category));
    },
    [dispatch]
  );

  const handleSortChange = useCallback(
    (sortBy: SortOption) => {
      dispatch(setSortBy(sortBy));
      hideBottomSheet();
    },
    [dispatch]
  );

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchProductsRequest({ loadMore: true }));
    }
  }, [dispatch, loading, hasMore]);

  const handleProductPress = useCallback(
    (productId: string) => {
      router.push(`/product/${productId}` as any);
    },
    [router]
  );

    const sortBottomSheet = useCallback(() => {
    showBottomSheet(
          <ModalContent onStartShouldSetResponder={() => true}>
            <ModalTitle>Sort By</ModalTitle>
            {sortOptions.map((option) => (
              <SortOptionButton
                key={option.value}
                selected={filters.sortBy === option.value}
                onPress={() => handleSortChange(option.value)}
              >
                <SortOptionText selected={filters.sortBy === option.value}>
                  {option.label}
                </SortOptionText>
              </SortOptionButton>
            ))}
          </ModalContent>
    ,)},
      ['100%']
    );

  const handleCartPress = useCallback(() => {
    router.push('/(tabs)/cart' as any);
  }, [router]);

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === filters.sortBy)?.label ||
    'Sort';

  if (error && products.length === 0) {
    return (
      <Container>
        <Stack.Screen
          options={{
            title: 'Products',
            headerRight: () => (
              <CartBadge count={cartItemsCount} onPress={handleCartPress} />
            ),
          }}
        />
        <ErrorContainer>
          <AlertCircle size={64} color={theme.colors.error} />
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Stack.Screen
        options={{
          title: 'Products',
          headerRight: () => (
            <CartBadge count={cartItemsCount} onPress={handleCartPress} />
          ),
        }}
      />
      
      <Header>
        <SearchBar
          value={filters.search}
          onChangeText={handleSearch}
          placeholder="Search products..."
        />
        
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <View style={{ flex: 1 }}>
            <FilterChips
              categories={categories}
              selectedCategory={filters.category}
              onSelectCategory={handleCategoryChange}
            />
          </View>
          <SortButton onPress={sortBottomSheet}>
            <ArrowUpDown size={16} color={theme.colors.text} />
            <SortText>{currentSortLabel}</SortText>
          </SortButton>
        </View>
      </Header>

      {loading && products.length === 0 ? (
        <LoadingSpinner message="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState
          title="No Products Found"
          message="Try adjusting your search or filters to find what you're looking for."
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item.id)}
            />
          )}
          contentContainerStyle={{
            padding: theme.spacing.md,
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && products.length > 0 ? (
              <LoadMoreContainer>
                <LoadingSpinner />
              </LoadMoreContainer>
            ) : null
          }
        />
      )}


    </Container>
  );
}
