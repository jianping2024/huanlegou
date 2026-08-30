import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize } from '../../theme';

interface PriceTagProps {
  price: number;
  minOrder?: number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceTag({ price, minOrder, unit = '件', size = 'md' }: PriceTagProps) {
  const priceSize = size === 'lg' ? fontSize.xxl : size === 'sm' ? fontSize.md : fontSize.lg;

  return (
    <View style={styles.row}>
      <Text style={styles.symbol}>¥</Text>
      <Text style={[styles.price, { fontSize: priceSize }]}>{price.toFixed(2)}</Text>
      {minOrder != null && (
        <Text style={styles.minOrder}>
          {' '}
          / {minOrder} {unit}起批
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  symbol: {
    color: colors.price,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  price: {
    color: colors.price,
    fontWeight: '700',
  },
  minOrder: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
});
