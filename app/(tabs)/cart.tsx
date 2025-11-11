import React, { useCallback } from 'react';
import { View, FlatList, Text, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { Trash2, Plus, Minus } from 'lucide-react-native';
import { theme } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { removeFromCart, updateQuantity } from '@/store/slices/cartSlice';
import { placeOrderRequest } from '@/store/slices/orderSlice';
import {
  selectCartItems,
  selectCartTotalPrice,
  selectOrderLoading,
} from '@/store/selectors';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ShoppingCart } from 'lucide-react-native';

const Container = styled(View)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const ListContent = styled(View)`
  flex: 1;
`;

const CartItem = styled(View)`
  flex-direction: row;
  background-color: ${theme.colors.white};
  margin: ${theme.spacing.sm}px ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.md}px;
  ${theme.shadows.sm.shadowColor && `shadow-color: ${theme.shadows.sm.shadowColor};`}
  ${theme.shadows.sm.shadowOffset && `shadow-offset: ${theme.shadows.sm.shadowOffset.width}px ${theme.shadows.sm.shadowOffset.height}px;`}
  ${theme.shadows.sm.shadowOpacity && `shadow-opacity: ${theme.shadows.sm.shadowOpacity};`}
  ${theme.shadows.sm.shadowRadius && `shadow-radius: ${theme.shadows.sm.shadowRadius}px;`}
  ${theme.shadows.sm.elevation && `elevation: ${theme.shadows.sm.elevation};`}
`;

const ItemImage = styled(Image)`
  width: 80px;
  height: 80px;
  border-radius: ${theme.borderRadius.md}px;
  background-color: ${theme.colors.surface};
`;

const ItemInfo = styled(View)`
  flex: 1;
  margin-left: ${theme.spacing.md}px;
  justify-content: space-between;
`;

const ItemHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const ItemDetails = styled(View)`
  flex: 1;
  margin-right: ${theme.spacing.sm}px;
`;

const ItemName = styled(Text)`
  font-size: ${theme.fontSize.md}px;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xs}px;
`;

const ItemBrand = styled(Text)`
  font-size: ${theme.fontSize.sm}px;
  color: ${theme.colors.textSecondary};
`;

const DeleteButton = styled.TouchableOpacity`
  padding: ${theme.spacing.xs}px;
`;

const ItemFooter = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.sm}px;
`;

const ItemPrice = styled(Text)`
  font-size: ${theme.fontSize.lg}px;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.primary};
`;

const QuantityContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.xs}px;
`;

const QuantityButton = styled.TouchableOpacity`
  padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
`;

const QuantityText = styled(Text)`
  font-size: ${theme.fontSize.md}px;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
  margin: 0 ${theme.spacing.sm}px;
  min-width: 30px;
  text-align: center;
`;

const Footer = styled(View)`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing.lg}px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
`;

const TotalRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md}px;
`;

const TotalLabel = styled(Text)`
  font-size: ${theme.fontSize.lg}px;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
`;

const TotalPrice = styled(Text)`
  font-size: ${theme.fontSize.xxl}px;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.primary};
`;

const StockWarning = styled(Text)`
  font-size: ${theme.fontSize.xs}px;
  color: ${theme.colors.warning};
  margin-top: ${theme.spacing.xs}px;
`;

export default function CartScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const orderLoading = useAppSelector(selectOrderLoading);

  const handleRemoveItem = useCallback(
    (productId: string) => {
      dispatch(removeFromCart(productId));
    },
    [dispatch]
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    },
    [dispatch]
  );

  const handleCheckout = useCallback(() => {
    if (cartItems.length > 0) {
      dispatch(placeOrderRequest());
      router.push('/order-confirmation' as any);
    }
  }, [dispatch, router, cartItems.length]);

  if (cartItems.length === 0) {
    return (
      <Container>
        <Stack.Screen
          options={{
            title: 'Shopping Cart',
          }}
        />
        <EmptyState
          title="Your cart is empty"
          message="Add some products to your cart to get started."
          icon={<ShoppingCart size={64} color={theme.colors.textLight} />}
        />
      </Container>
    );
  }

  return (
    <Container>
      <Stack.Screen
        options={{
          title: 'Shopping Cart',
        }}
      />
      
      <ListContent>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.product.id}
          contentContainerStyle={{
            paddingVertical: theme.spacing.sm,
          }}
          renderItem={({ item }) => {
            const isOverStock = item.quantity > item.product.stock;
            const itemTotal = item.product.price * item.quantity;

            return (
              <CartItem testID={`cart-item-${item.product.id}`}>
                <ItemImage
                  source={{ uri: item.product.image }}
                  resizeMode="cover"
                />
                <ItemInfo>
                  <ItemHeader>
                    <ItemDetails>
                      <ItemBrand>{item.product.brand}</ItemBrand>
                      <ItemName numberOfLines={2}>{item.product.name}</ItemName>
                    </ItemDetails>
                    <DeleteButton
                      onPress={() => handleRemoveItem(item.product.id)}
                      testID={`remove-item-${item.product.id}`}
                    >
                      <Trash2 size={20} color={theme.colors.error} />
                    </DeleteButton>
                  </ItemHeader>
                  
                  <ItemFooter>
                    <ItemPrice>${itemTotal.toFixed(2)}</ItemPrice>
                    <QuantityContainer>
                      <QuantityButton
                        onPress={() =>
                          handleUpdateQuantity(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                        testID={`decrease-quantity-${item.product.id}`}
                      >
                        <Minus size={16} color={theme.colors.text} />
                      </QuantityButton>
                      <QuantityText>{item.quantity}</QuantityText>
                      <QuantityButton
                        onPress={() =>
                          handleUpdateQuantity(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        disabled={item.quantity >= item.product.stock}
                        testID={`increase-quantity-${item.product.id}`}
                      >
                        <Plus
                          size={16}
                          color={
                            item.quantity >= item.product.stock
                              ? theme.colors.textLight
                              : theme.colors.text
                          }
                        />
                      </QuantityButton>
                    </QuantityContainer>
                  </ItemFooter>
                  
                  {isOverStock && (
                    <StockWarning>
                      Only {item.product.stock} available in stock
                    </StockWarning>
                  )}
                </ItemInfo>
              </CartItem>
            );
          }}
        />
      </ListContent>

      <Footer>
        <TotalRow>
          <TotalLabel>Total:</TotalLabel>
          <TotalPrice>${totalPrice.toFixed(2)}</TotalPrice>
        </TotalRow>
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          fullWidth
          loading={orderLoading}
          testID="checkout-button"
        />
      </Footer>
    </Container>
  );
}
