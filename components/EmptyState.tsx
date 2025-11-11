import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { PackageOpen } from 'lucide-react-native';
import { theme } from '@/theme';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xl}px;
`;

const IconContainer = styled(View)`
  margin-bottom: ${theme.spacing.lg}px;
`;

const Title = styled(Text)`
  font-size: ${theme.fontSize.xl}px;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm}px;
  text-align: center;
`;

const Message = styled(Text)`
  font-size: ${theme.fontSize.md}px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  line-height: 22px;
`;

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
}) => {
  return (
    <Container testID="empty-state">
      <IconContainer>
        {icon || <PackageOpen size={64} color={theme.colors.textLight} />}
      </IconContainer>
      <Title>{title}</Title>
      <Message>{message}</Message>
    </Container>
  );
};
