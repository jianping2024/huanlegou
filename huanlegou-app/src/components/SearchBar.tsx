import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme';

interface SearchBarProps {
  placeholder?: string;
  onPress?: () => void;
}

export function SearchBar({ placeholder = '搜索小商品、店铺', onPress }: SearchBarProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Ionicons name="search" size={18} color={colors.textSecondary} />
      <Text style={styles.placeholder}>{placeholder}</Text>
      <View style={styles.scanBtn}>
        <Ionicons name="scan-outline" size={20} color={colors.primary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    gap: spacing.sm,
  },
  placeholder: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  scanBtn: {
    paddingLeft: spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
});
