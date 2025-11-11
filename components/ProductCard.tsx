import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Star } from 'lucide-react-native';
import { theme } from '@/theme';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const Card = styled(TouchableOpacity)`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg}px;
  overflow: hidden;
  margin-bottom: ${theme.spacing.md}px;
  ${theme.shadows.md.shadowColor && `shadow-color: ${theme.shadows.md.shadowColor};`}
  ${theme.shadows.md.shadowOffset && `shadow-offset: ${theme.shadows.md.shadowOffset.width}px ${theme.shadows.md.shadowOffset.height}px;`}
  ${theme.shadows.md.shadowOpacity && `shadow-opacity: ${theme.shadows.md.shadowOpacity};`}
  ${theme.shadows.md.shadowRadius && `shadow-radius: ${theme.shadows.md.shadowRadius}px;`}
  ${theme.shadows.md.elevation && `elevation: ${theme.shadows.md.elevation};`}
`;

const ProductImage = styled(Image)`
  width: 100%;
  height: 200px;
  background-color: ${theme.colors.surface};
`;

const CardContent = styled(View)`
  padding: ${theme.spacing.md}px;
`;

const ProductName = styled(Text)`
  font-size: ${theme.fontSize.md}px;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xs}px;
`;

const ProductBrand = styled(Text)`
  font-size: ${theme.fontSize.sm}px;
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.sm}px;
`;

const BottomRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.xs}px;
`;

const PriceText = styled(Text)`
  font-size: ${theme.fontSize.lg}px;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.primary};
`;

const RatingContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.xs}px;
`;

const RatingText = styled(Text)`
  font-size: ${theme.fontSize.sm}px;
  color: ${theme.colors.textSecondary};
  margin-left: ${theme.spacing.xs}px;
`;

const StockBadge = styled(View)<{ inStock: boolean }>`
  position: absolute;
  top: ${theme.spacing.sm}px;
  right: ${theme.spacing.sm}px;
  background-color: ${({ inStock }) => inStock ? theme.colors.success : theme.colors.error};
  padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.sm}px;
`;

const StockText = styled(Text)`
  color: ${theme.colors.white};
  font-size: ${theme.fontSize.xs}px;
  font-weight: ${theme.fontWeight.semibold};
`;

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const inStock = product.stock > 0;

  return (
    <Card onPress={onPress} activeOpacity={0.8} testID={`product-card-${product.id}`}>
      <View>
        <ProductImage source={{ uri: product.image }} resizeMode="cover" />
        <StockBadge inStock={inStock}>
          <StockText>{inStock ? 'In Stock' : 'Out of Stock'}</StockText>
        </StockBadge>
      </View>
      <CardContent>
        <ProductBrand>{product.brand}</ProductBrand>
        <ProductName numberOfLines={2}>{product.name}</ProductName>
        <BottomRow>
          <PriceText>${product.price.toFixed(2)}</PriceText>
          <RatingContainer>
            <Star size={16} color={theme.colors.rating} fill={theme.colors.rating} />
            <RatingText>
              {product.rating.toFixed(1)} ({product.reviewCount})
            </RatingText>
          </RatingContainer>
        </BottomRow>
      </CardContent>
    </Card>
  );
};
