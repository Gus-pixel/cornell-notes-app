import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { DataProvider } from './src/contexts/DataContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AppNavigator } from './src/navigation';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ThemeProvider>
          <StatusBar style="light" backgroundColor="#FF8C42" />
          <AppNavigator />
        </ThemeProvider>
      </DataProvider>
    </AuthProvider>
  );
}
