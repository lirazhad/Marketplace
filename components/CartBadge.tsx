import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { ShoppingCart } from 'lucide-react-native';
import { theme } from '@/theme';

interface CartBadgeProps {
  count: number;
  onPress: () => void;
}

const Container = styled.TouchableOpacity`
  position: relative;
  padding: ${theme.spacing.xs}px;
`;

const Badge = styled(View)`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${theme.colors.error};
  border-radius: ${theme.borderRadius.full}px;
  min-width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  padding: 2px 4px;
`;

const BadgeText = styled(Text)`
  color: ${theme.colors.white};
  font-size: ${theme.fontSize.xs}px;
  font-weight: ${theme.fontWeight.bold};
`;

export const CartBadge: React.FC<CartBadgeProps> = ({ count, onPress }) => {
  return (
    <Container onPress={onPress} testID="cart-badge">
      <ShoppingCart size={24} color={theme.colors.text} />
      {count > 0 && (
        <Badge>
          <BadgeText>{count > 99 ? '99+' : count}</BadgeText>
        </Badge>
      )}
    </Container>
  );
};
