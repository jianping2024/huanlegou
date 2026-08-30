import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Product } from '../types';
import { colors, fontSize, radius, spacing } from '../theme';
import { PriceTag } from './PriceTag';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  layout?: 'grid' | 'list';
}

export function ProductCard({ product, onPress, layout = 'grid' }: ProductCardProps) {
  if (layout === 'list') {
    return (
      <Pressable style={styles.listCard} onPress={onPress}>
        <Image source={{ uri: product.image }} style={styles.listImage} contentFit="cover" />
        <View style={styles.listContent}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <PriceTag price={product.price} minOrder={product.minOrder} unit={product.unit} size="md" />
          <Text style={styles.shop} numberOfLines={1}>
            {product.shopName}
          </Text>
          <Text style={styles.sales}>已售 {formatSales(product.sales)}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.gridCard} onPress={onPress}>
      <Image source={{ uri: product.image }} style={styles.gridImage} contentFit="cover" />
      <View style={styles.gridContent}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <PriceTag price={product.price} minOrder={product.minOrder} unit={product.unit} size="sm" />
        <Text style={styles.shop} numberOfLines={1}>
          {product.shopName}
        </Text>
      </View>
    </Pressable>
  );
}

function formatSales(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return String(n);
}

const styles = StyleSheet.create({
  gridCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  gridImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.border,
  },
  gridContent: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  listCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    padding: spacing.sm,
    gap: spacing.md,
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  listContent: {
    flex: 1,
    gap: spacing.xs,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: 18,
  },
  shop: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  sales: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
});
