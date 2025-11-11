import React from 'react';
import { TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '@/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  testID?: string;
}

const StyledButton = styled(TouchableOpacity)<{
  variant: 'primary' | 'secondary' | 'outline';
  fullWidth: boolean;
  disabled: boolean;
}>`
  padding: ${theme.spacing.md}px ${theme.spacing.lg}px;
  border-radius: ${theme.borderRadius.md}px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  min-height: 48px;
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
  ${({ variant, disabled }) => {
    if (disabled) {
      return `
        background-color: ${theme.colors.border};
        border: none;
      `;
    }
    
    switch (variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          border: none;
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary};
          border: none;
        `;
      case 'outline':
        return `
          background-color: transparent;
          border: 2px solid ${theme.colors.primary};
        `;
      default:
        return '';
    }
  }}
`;

const ButtonText = styled(Text)<{
  variant: 'primary' | 'secondary' | 'outline';
  disabled: boolean;
}>`
  font-size: ${theme.fontSize.md}px;
  font-weight: ${theme.fontWeight.semibold};
  ${({ variant, disabled }) => {
    if (disabled) {
      return `color: ${theme.colors.textLight};`;
    }
    
    return variant === 'outline'
      ? `color: ${theme.colors.primary};`
      : `color: ${theme.colors.white};`;
  }}
`;

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  testID,
}) => {
  const isDisabled = disabled || loading;

  return (
    <StyledButton
      variant={variant}
      fullWidth={fullWidth}
      disabled={isDisabled}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? theme.colors.primary : theme.colors.white}
        />
      ) : (
        <ButtonText variant={variant} disabled={isDisabled}>
          {title}
        </ButtonText>
      )}
    </StyledButton>
  );
};
