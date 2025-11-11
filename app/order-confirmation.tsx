/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { CheckCircle } from 'lucide-react-native';
import { theme } from '@/theme';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { selectCurrentOrder, selectOrderLoading, selectOrderError } from '@/store/selectors';
import { clearCurrentOrder } from '@/store/slices/orderSlice';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled(View)`
  flex: 1;
  padding: ${theme.spacing.xl}px;
  align-items: center;
  justify-content: center;
`;

const IconContainer = styled(View)`
  margin-bottom: ${theme.spacing.xl}px;
`;

const Title = styled(Text)`
  font-size: ${theme.fontSize.xxxl}px;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

const Message = styled(Text)`
  font-size: ${theme.fontSize.md}px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  line-height: 24px;
  margin-bottom: ${theme.spacing.xl}px;
`;

const OrderCard = styled(View)`
  width: 100%;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.lg}px;
  margin-bottom: ${theme.spacing.xl}px;
  ${theme.shadows.md.shadowColor && `shadow-color: ${theme.shadows.md.shadowColor};`}
  ${theme.shadows.md.shadowOffset && `shadow-offset: ${theme.shadows.md.shadowOffset.width}px ${theme.shadows.md.shadowOffset.height}px;`}
  ${theme.shadows.md.shadowOpacity && `shadow-opacity: ${theme.shadows.md.shadowOpacity};`}
  ${theme.shadows.md.shadowRadius && `shadow-radius: ${theme.shadows.md.shadowRadius}px;`}
  ${theme.shadows.md.elevation && `elevation: ${theme.shadows.md.elevation};`}
`;

const OrderRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

const OrderLabel = styled(Text)`
  font-size: ${theme.fontSize.md}px;
  color: ${theme.colors.textSecondary};
`;

const OrderValue = styled(Text)`
  font-size: ${theme.fontSize.md}px;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
`;

const Divider = styled(View)`
  height: 1px;
  background-color: ${theme.colors.border};
  margin: ${theme.spacing.md}px 0;
`;

const TotalRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.sm}px;
`;

const TotalLabel = styled(Text)`
  font-size: ${theme.fontSize.lg}px;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
`;

const TotalValue = styled(Text)`
  font-size: ${theme.fontSize.xxl}px;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.primary};
`;

const ButtonContainer = styled(View)`
  width: 100%;
  gap: ${theme.spacing.sm}px;
`;

const ErrorContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl}px;
`;

const ErrorText = styled(Text)`
  font-size: ${theme.fontSize.md}px;
  color: ${theme.colors.error};
  text-align: center;
  margin-top: ${theme.spacing.md}px;
`;

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const order = useAppSelector(selectCurrentOrder);
  const loading = useAppSelector(selectOrderLoading);
  const error = useAppSelector(selectOrderError);

  useEffect(() => {
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch]);

  const handleContinueShopping = () => {
    router.push('/(tabs)/products' as any);
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner message="Processing your order..." />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorText>{error || 'Failed to place order'}</ErrorText>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="outline"
          />
        </ErrorContainer>
      </Container>
    );
  }

  const orderDate = new Date(order.createdAt);

  return (
    <Container contentContainerStyle={{ flexGrow: 1 }}>
      <Content>
        <IconContainer>
          <CheckCircle size={80} color={theme.colors.success} />
        </IconContainer>

        <Title>Order Confirmed!</Title>
        <Message>
          Thank you for your purchase. Your order has been successfully placed
          and will be processed shortly.
        </Message>

        <OrderCard>
          <OrderRow>
            <OrderLabel>Order ID:</OrderLabel>
            <OrderValue>{order.id}</OrderValue>
          </OrderRow>
          <OrderRow>
            <OrderLabel>Date:</OrderLabel>
            <OrderValue>{orderDate.toLocaleDateString()}</OrderValue>
          </OrderRow>
          <OrderRow>
            <OrderLabel>Time:</OrderLabel>
            <OrderValue>{orderDate.toLocaleTimeString()}</OrderValue>
          </OrderRow>
          <OrderRow>
            <OrderLabel>Items:</OrderLabel>
            <OrderValue>{order.items.length} item(s)</OrderValue>
          </OrderRow>

          <Divider />

          <TotalRow>
            <TotalLabel>Total:</TotalLabel>
            <TotalValue>${order.totalPrice.toFixed(2)}</TotalValue>
          </TotalRow>
        </OrderCard>

        <ButtonContainer>
          <Button
            title="Continue Shopping"
            onPress={handleContinueShopping}
            fullWidth
            testID="continue-shopping-button"
          />
        </ButtonContainer>
      </Content>
    </Container>
  );
}
