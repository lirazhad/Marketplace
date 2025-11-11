import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '@/theme';

interface LoadingSpinnerProps {
  message?: string;
}

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xl}px;
`;

const Message = styled(Text)`
  margin-top: ${theme.spacing.md}px;
  font-size: ${theme.fontSize.md}px;
  color: ${theme.colors.textSecondary};
`;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <Container testID="loading-spinner">
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message && <Message>{message}</Message>}
    </Container>
  );
};
