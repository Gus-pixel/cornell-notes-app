import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface PremiumBadgeProps {
  size?: 'small' | 'medium' | 'large';
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ size = 'medium' }) => {
  const { theme } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { paddingHorizontal: 6, paddingVertical: 2 },
          text: { fontSize: 10 },
          icon: 12,
        };
      case 'large':
        return {
          container: { paddingHorizontal: 12, paddingVertical: 6 },
          text: { fontSize: 16 },
          icon: 18,
        };
      default:
        return {
          container: { paddingHorizontal: 8, paddingVertical: 4 },
          text: { fontSize: 12 },
          icon: 14,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFD700',
      borderRadius: 12,
      ...sizeStyles.container,
    },
    text: {
      color: '#000',
      fontWeight: 'bold',
      marginLeft: 4,
      ...sizeStyles.text,
    },
  });

  return (
    <View style={styles.container}>
      <Ionicons name="star" size={sizeStyles.icon} color="#000" />
      <Text style={styles.text}>PREMIUM</Text>
    </View>
  );
};
