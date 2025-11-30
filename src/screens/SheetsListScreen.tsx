import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, CornellSheet } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button, Card, EmptyState } from '../components';
import { canCreateSheet, getLimitMessage } from '../utils/validation';

type Props = NativeStackScreenProps<HomeStackParamList, 'SheetsList'>;

export const SheetsListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { subjectId } = route.params;
  const { user } = useAuth();
  const { sheets, deleteSheet, getSheetsBySubject } = useData();
  const { theme } = useTheme();

  const subjectSheets = getSheetsBySubject(subjectId);

  const handleCreateSheet = () => {
    if (!user) return;

    if (!canCreateSheet(user, sheets, subjectId)) {
      Alert.alert('Limite atingido', getLimitMessage('sheet'));
      return;
    }

    navigation.navigate('SheetEditor', { subjectId });
  };

  const handleDeleteSheet = (sheet: CornellSheet) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja excluir a folha "${sheet.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteSheet(sheet.id),
        },
      ]
    );
  };

  const renderSheet = ({ item }: { item: CornellSheet }) => (
    <Card
      onPress={() => navigation.navigate('SheetEditor', { sheetId: item.id, subjectId })}
      backgroundColor={item.colors?.backgroundColor}
    >
      <View style={styles.sheetHeader}>
        <Text
          style={[
            styles.sheetTitle,
            { color: item.colors?.titleColor || theme.text },
          ]}
        >
          {item.title}
        </Text>
        <Ionicons
          name="trash-outline"
          size={20}
          color={theme.error}
          onPress={() => handleDeleteSheet(item)}
        />
      </View>
      
      <View style={styles.sheetInfo}>
        <Text style={styles.sheetInfoText}>
          {item.topics.length} tópicos • {item.notes.length} anotações
        </Text>
        <Text style={styles.sheetDate}>
          {item.updatedAt.toLocaleDateString()}
        </Text>
      </View>

      {item.summary && (
        <Text
          style={[
            styles.sheetSummary,
            { color: item.colors?.summaryColor || theme.textSecondary },
          ]}
          numberOfLines={2}
        >
          {item.summary}
        </Text>
      )}
    </Card>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    sheetTitle: {
      fontSize: 18,
      fontWeight: '600',
      flex: 1,
    },
    sheetInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    sheetInfoText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    sheetDate: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    sheetSummary: {
      fontSize: 14,
      fontStyle: 'italic',
      marginTop: 4,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {subjectSheets.length === 0 ? (
          <EmptyState
            icon="document-text-outline"
            title="Nenhuma folha encontrada"
            message="Crie sua primeira folha Cornell para começar a tomar notas organizadas."
            actionTitle="Criar folha"
            onAction={handleCreateSheet}
          />
        ) : (
          <FlatList
            data={subjectSheets}
            renderItem={renderSheet}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}

        <Button
          title="Nova Folha Cornell"
          onPress={handleCreateSheet}
          style={{ marginTop: 16 }}
        />
      </View>
    </SafeAreaView>
  );
};
