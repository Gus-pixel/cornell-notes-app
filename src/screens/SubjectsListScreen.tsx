import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, Subject } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button, Card, Input, ColorPicker, EmptyState } from '../components';
import { canCreateSubject, canCustomizeColors, getLimitMessage } from '../utils/validation';

type Props = NativeStackScreenProps<HomeStackParamList, 'SubjectsList'>;

export const SubjectsListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { notebookId } = route.params;
  const { user } = useAuth();
  const { subjects, createSubject, deleteSubject, getSubjectsByNotebook } = useData();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(theme.surface);
  const [titleColor, setTitleColor] = useState(theme.text);
  const [loading, setLoading] = useState(false);

  const notebookSubjects = getSubjectsByNotebook(notebookId);

  const handleCreateSubject = async () => {
    if (!user) return;

    if (!canCreateSubject(user, subjects, notebookId)) {
      Alert.alert('Limite atingido', getLimitMessage('subject'));
      return;
    }

    if (!title.trim()) {
      Alert.alert('Erro', 'Título é obrigatório');
      return;
    }

    setLoading(true);
    try {
      const colors = canCustomizeColors(user) ? { backgroundColor, titleColor } : undefined;
      await createSubject(title, notebookId, colors);
      setModalVisible(false);
      setTitle('');
      setBackgroundColor(theme.surface);
      setTitleColor(theme.text);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar matéria');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = (subject: Subject) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja excluir a matéria "${subject.title}"? Todas as folhas serão perdidas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteSubject(subject.id),
        },
      ]
    );
  };

  const renderSubject = ({ item }: { item: Subject }) => (
    <Card
      onPress={() => navigation.navigate('SheetsList', { subjectId: item.id })}
      backgroundColor={item.colors?.backgroundColor}
    >
      <View style={styles.subjectHeader}>
        <Text
          style={[
            styles.subjectTitle,
            { color: item.colors?.titleColor || theme.text },
          ]}
        >
          {item.title}
        </Text>
        <Ionicons
          name="trash-outline"
          size={20}
          color={theme.error}
          onPress={() => handleDeleteSubject(item)}
        />
      </View>
      <Text style={styles.subjectDate}>
        Criado em {item.createdAt.toLocaleDateString()}
      </Text>
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
    subjectHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    subjectTitle: {
      fontSize: 18,
      fontWeight: '600',
      flex: 1,
    },
    subjectDate: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 24,
      width: '90%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    modalButton: {
      flex: 1,
      marginHorizontal: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {notebookSubjects.length === 0 ? (
          <EmptyState
            icon="library-outline"
            title="Nenhuma matéria encontrada"
            message="Crie sua primeira matéria para começar a organizar suas folhas Cornell."
            actionTitle="Criar matéria"
            onAction={() => setModalVisible(true)}
          />
        ) : (
          <FlatList
            data={notebookSubjects}
            renderItem={renderSubject}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}

        <Button
          title="Nova Matéria"
          onPress={() => setModalVisible(true)}
          style={{ marginTop: 16 }}
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Matéria</Text>

            <Input
              label="Título"
              value={title}
              onChangeText={setTitle}
              placeholder="Digite o título da matéria"
            />

            <ColorPicker
              label="Cor de fundo"
              selectedColor={backgroundColor}
              onColorSelect={setBackgroundColor}
              disabled={!canCustomizeColors(user!)}
            />

            <ColorPicker
              label="Cor do título"
              selectedColor={titleColor}
              onColorSelect={setTitleColor}
              disabled={!canCustomizeColors(user!)}
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title={loading ? 'Criando...' : 'Criar'}
                onPress={handleCreateSubject}
                disabled={loading}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
