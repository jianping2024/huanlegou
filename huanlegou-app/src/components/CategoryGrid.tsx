import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Category } from '../types';
import { colors, fontSize, spacing } from '../theme';

interface CategoryGridProps {
  categories: Category[];
  onPress?: (category: Category) => void;
}

export function CategoryGrid({ categories, onPress }: CategoryGridProps) {
  const displayCategories = categories.slice(0, 10);

  return (
    <View style={styles.container}>
      {displayCategories.map((cat) => (
        <Pressable key={cat.id} style={styles.item} onPress={() => onPress?.(cat)}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>{cat.icon}</Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {cat.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  item: {
    width: '20%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  icon: {
    fontSize: 22,
  },
  name: {
    fontSize: fontSize.xs,
    color: colors.text,
    textAlign: 'center',
  },
});
