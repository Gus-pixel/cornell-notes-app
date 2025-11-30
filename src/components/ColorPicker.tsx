import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getColorPalette } from '../utils/theme';

interface ColorPickerProps {
  label: string;
  selectedColor?: string;
  onColorSelect: (color: string) => void;
  disabled?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  selectedColor,
  onColorSelect,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const colors = getColorPalette();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.text,
      marginBottom: 8,
    },
    colorsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    colorButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedColor: {
      borderColor: theme.text,
      borderWidth: 3,
    },
    disabledOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: 20,
    },
  });

  if (disabled) {
    return (
      <View style={styles.container}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {label} (Premium)
        </Text>
        <View style={styles.colorsContainer}>
          {colors.slice(0, 5).map((color) => (
            <View key={color} style={styles.colorButton}>
              <View style={[styles.colorButton, { backgroundColor: color, borderWidth: 0 }]} />
              <View style={styles.disabledOverlay} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.colorsContainer}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColor,
              ]}
              onPress={() => onColorSelect(color)}
              activeOpacity={0.7}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
