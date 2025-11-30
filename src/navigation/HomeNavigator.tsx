import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types';
import { NotebooksListScreen } from '../screens/NotebooksListScreen';
import { SubjectsListScreen } from '../screens/SubjectsListScreen';
import { SheetsListScreen } from '../screens/SheetsListScreen';
import { SheetEditorScreen } from '../screens/SheetEditorScreen';
import { useTheme } from '../contexts/ThemeContext';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="NotebooksList"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="NotebooksList" 
        component={NotebooksListScreen}
        options={{ title: 'Cornell Notes' }}
      />
      <Stack.Screen 
        name="SubjectsList" 
        component={SubjectsListScreen}
        options={{ title: 'Matérias' }}
      />
      <Stack.Screen 
        name="SheetsList" 
        component={SheetsListScreen}
        options={{ title: 'Folhas Cornell' }}
      />
      <Stack.Screen 
        name="SheetEditor" 
        component={SheetEditorScreen}
        options={{ title: 'Editar Folha' }}
      />
    </Stack.Navigator>
  );
};
