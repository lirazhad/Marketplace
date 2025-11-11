/* eslint-disable import/no-unresolved */
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import styled from 'styled-components/native';
import { Star, Minus, Plus } from 'lucide-react-native';
import { theme } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchProductByIdRequest } from '@/store/slices/productsSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { selectCurrentProduct, selectProductLoading } from '@/store/selectors';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const ProductImage = styled(Image)`
  width: 100%;
  height: 400px;
  background-color: ${theme.colors.surface};
`;

const Content = styled(View)`
  padding: ${theme.spacing.lg}px;
`;

const Brand = styled(Text)`
  font-size: ${theme.fontSize.sm}px;
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: ${theme.spacing.xs}px;
`;

const ProductName = styled(Text)`
  font-size: ${theme.fontSize.xxl}px;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md}px;
  line-height: 36px;
`;

const RatingRow = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${theme.spacing.lg}px;
`;

const RatingText = styled(Text)`
  font-size: ${theme.fontSize.md}px;
  color: ${theme.colors.text};
  font-weight: ${theme.fontWeight.semibold};
  margin-left: ${theme.spacing.xs}px;
  margin-right: ${theme.spacing.sm}px;
`;

const ReviewCount = styled(Text)`
  font-size: ${theme.fontSize.sm}px;
  color: ${theme.colors.textSecondary};
`;

const PriceRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg}px;
`;

const Price = styled(Text)`
  font-size: ${theme.fontSize.xxxl}px;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.primary};
`;

const StockBadge = styled(View)<{ inStock: boolean }>`
  background-color: ${({ inStock }) =>
    inStock ? theme.colors.success : theme.colors.error};
  padding: ${theme.spacing.xs}px ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.full}px;
`;

const StockText = styled(Text)`
  color: ${theme.colors.white};
  font-size: ${theme.fontSize.sm}px;
  font-weight: ${theme.fontWeight.semibold};
`;

const SectionTitle = styled(Text)`
  font-size: ${theme.fontSize.lg}px;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm}px;
`;

const Description = styled(Text)`
  font-size: ${theme.fontSize.md}px;
  color: ${theme.colors.textSecondary};
  line-height: 24px;
  margin-bottom: ${theme.spacing.xl}px;
`;

const QuantitySelector = styled(View)`
  margin-bottom: ${theme.spacing.lg}px;
`;

const QuantityRow = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.md}px;
`;

const QuantityControls = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.xs}px;
  border: 1px solid ${theme.colors.border};
`;

const QuantityButton = styled.TouchableOpacity`
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
`;

const QuantityText = styled(Text)`
  font-size: ${theme.fontSize.lg}px;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
  margin: 0 ${theme.spacing.md}px;
  min-width: 40px;
  text-align: center;
`;

const QuantityLabel = styled(Text)`
  font-size: ${theme.fontSize.md}px;
  color: ${theme.colors.textSecondary};
`;

const ButtonContainer = styled(View)`
  gap: ${theme.spacing.sm}px;
  margin-bottom: ${theme.spacing.xl}px;
`;

const SuccessMessage = styled(View)`
  background-color: ${theme.colors.success};
  padding: ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.md}px;
  margin-top: ${theme.spacing.md}px;
`;

const SuccessText = styled(Text)`
  color: ${theme.colors.white};
  font-size: ${theme.fontSize.md}px;
  font-weight: ${theme.fontWeight.semibold};
  text-align: center;
`;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const product = useAppSelector(selectCurrentProduct);
  const loading = useAppSelector(selectProductLoading);

  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdRequest(id));
    }
  }, [id, dispatch]);

  const handleIncreaseQuantity = useCallback(() => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  }, [product, quantity]);

  const handleDecreaseQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }, [quantity]);

  const handleAddToCart = useCallback(() => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setQuantity(1);
    }
  }, [dispatch, product, quantity]);

  if (loading || !product) {
    return (
      <Container>
        <LoadingSpinner message="Loading product details..." />
      </Container>
    );
  }

  const inStock = product.stock > 0;

  return (
    <Container>
      <ProductImage source={{ uri: product.image }} resizeMode="cover" />
      
      <Content>
        <Brand>{product.brand}</Brand>
        <ProductName>{product.name}</ProductName>

        <RatingRow>
          <Star size={20} color={theme.colors.rating} fill={theme.colors.rating} />
          <RatingText>{product.rating.toFixed(1)}</RatingText>
          <ReviewCount>({product.reviewCount} reviews)</ReviewCount>
        </RatingRow>

        <PriceRow>
          <Price>${product.price.toFixed(2)}</Price>
          <StockBadge inStock={inStock}>
            <StockText>
              {inStock ? `${product.stock} in stock` : 'Out of Stock'}
            </StockText>
          </StockBadge>
        </PriceRow>

        <SectionTitle>Description</SectionTitle>
        <Description>{product.description}</Description>

        {inStock && (
          <>
            <QuantitySelector>
              <SectionTitle>Quantity</SectionTitle>
              <QuantityRow>
                <QuantityControls>
                  <QuantityButton
                    onPress={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                    testID="decrease-quantity"
                  >
                    <Minus
                      size={20}
                      color={
                        quantity <= 1
                          ? theme.colors.textLight
                          : theme.colors.text
                      }
                    />
                  </QuantityButton>
                  <QuantityText>{quantity}</QuantityText>
                  <QuantityButton
                    onPress={handleIncreaseQuantity}
                    disabled={quantity >= product.stock}
                    testID="increase-quantity"
                  >
                    <Plus
                      size={20}
                      color={
                        quantity >= product.stock
                          ? theme.colors.textLight
                          : theme.colors.text
                      }
                    />
                  </QuantityButton>
                </QuantityControls>
                <QuantityLabel>
                  ({product.stock} available)
                </QuantityLabel>
              </QuantityRow>
            </QuantitySelector>

            <ButtonContainer>
              <Button
                title="Add to Cart"
                onPress={handleAddToCart}
                fullWidth
                testID="add-to-cart-button"
              />
            </ButtonContainer>

            {showSuccess && (
              <SuccessMessage>
                <SuccessText>Added to cart successfully!</SuccessText>
              </SuccessMessage>
            )}
          </>
        )}
      </Content>
    </Container>
  );
}
