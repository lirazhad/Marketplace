import React from 'react';
import { TextInput, View } from 'react-native';
import styled from 'styled-components/native';
import { Search, X } from 'lucide-react-native';
import { theme } from '@/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  border: 1px solid ${theme.colors.border};
`;

const StyledInput = styled(TextInput)`
  flex: 1;
  font-size: ${theme.fontSize.md}px;
  color: ${theme.colors.text};
  margin-left: ${theme.spacing.sm}px;
  padding: 0px;
`;

const IconButton = styled.TouchableOpacity`
  padding: ${theme.spacing.xs}px;
`;

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search products...',
}) => {
  return (
    <Container>
      <Search size={20} color={theme.colors.textSecondary} />
      <StyledInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textLight}
        testID="search-input"
      />
      {value.length > 0 && (
        <IconButton onPress={() => onChangeText('')} testID="clear-search">
          <X size={20} color={theme.colors.textSecondary} />
        </IconButton>
      )}
    </Container>
  );
};
