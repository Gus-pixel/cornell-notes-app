import { Theme } from '../types';

export const defaultTheme: Theme = {
  primary: '#FF8C42',      // Orange primary
  secondary: '#FFB366',    // Lighter orange
  background: '#FFFFFF',   // White background
  surface: '#F8F9FA',      // Light gray surface
  text: '#2C3E50',         // Dark blue-gray text
  textSecondary: '#6C757D', // Gray secondary text
  border: '#E9ECEF',       // Light border
  success: '#28A745',      // Green
  warning: '#FFC107',      // Yellow
  error: '#DC3545',        // Red
};

export const premiumTheme: Theme = {
  primary: '#E67E22',      // Darker orange for premium
  secondary: '#F39C12',    // Golden orange
  background: '#FEFEFE',   // Slightly off-white
  surface: '#FDF6E3',      // Warm surface
  text: '#2C3E50',
  textSecondary: '#6C757D',
  border: '#E9ECEF',
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
};

export const getColorPalette = () => [
  '#FF8C42', // Default orange
  '#E67E22', // Dark orange
  '#F39C12', // Golden
  '#3498DB', // Blue
  '#9B59B6', // Purple
  '#E74C3C', // Red
  '#27AE60', // Green
  '#F1C40F', // Yellow
  '#34495E', // Dark gray
  '#95A5A6', // Light gray
];
