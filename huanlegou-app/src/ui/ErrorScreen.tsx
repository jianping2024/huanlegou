import { Pressable, StyleSheet, Text, View } from 'react-native';

type ErrorScreenProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
};

export default function ErrorScreen({
  title,
  message,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
}: ErrorScreenProps) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable style={styles.actionBtn} onPress={onAction}>
          <Text style={styles.actionBtnText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
      {secondaryLabel && onSecondaryAction ? (
        <Pressable style={styles.secondaryBtn} onPress={onSecondaryAction}>
          <Text style={styles.secondaryBtnText}>{secondaryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  message: {
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 13,
  },
  actionBtn: {
    marginTop: 20,
    backgroundColor: '#FF5000',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryBtn: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  secondaryBtnText: {
    color: '#FF5000',
    fontSize: 14,
  },
});
