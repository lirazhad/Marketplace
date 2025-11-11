import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '@/theme';
import { ProductCategory } from '@/types';

interface FilterChipsProps {
  categories: ProductCategory[];
  selectedCategory: ProductCategory | null;
  onSelectCategory: (category: ProductCategory | null) => void;
}

const Container = styled(ScrollView).attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
})`
  flex-grow: 0;
`;

const Chip = styled(TouchableOpacity)<{ selected: boolean }>`
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.full}px;
  background-color: ${({ selected }) =>
    selected ? theme.colors.primary : theme.colors.surface};
  border: 1px solid ${({ selected }) =>
    selected ? theme.colors.primary : theme.colors.border};
`;

const ChipText = styled(Text)<{ selected: boolean }>`
  font-size: ${theme.fontSize.sm}px;
  font-weight: ${theme.fontWeight.medium};
  color: ${({ selected }) =>
    selected ? theme.colors.white : theme.colors.text};
`;

export const FilterChips: React.FC<FilterChipsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const allCategories: (ProductCategory | null)[] = [null, ...categories];

  return (
    <Container>
      {allCategories.map((category) => {
        const isSelected = category === selectedCategory;
        const label = category || 'All';

        return (
          <Chip
            key={label}
            selected={isSelected}
            onPress={() => onSelectCategory(category)}
            activeOpacity={0.7}
            testID={`category-chip-${label}`}
          >
            <ChipText selected={isSelected}>{label}</ChipText>
          </Chip>
        );
      })}
    </Container>
  );
};
