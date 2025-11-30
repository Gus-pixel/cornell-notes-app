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
import { HomeStackParamList, Notebook } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button, Card, Input, ColorPicker, EmptyState, PremiumBadge } from '../components';
import { canCreateNotebook, canCustomizeColors, getLimitMessage } from '../utils/validation';

type Props = NativeStackScreenProps<HomeStackParamList, 'NotebooksList'>;

export const NotebooksListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const { notebooks, createNotebook, deleteNotebook, getNotebooksByUser } = useData();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(theme.surface);
  const [titleColor, setTitleColor] = useState(theme.text);
  const [loading, setLoading] = useState(false);

  const userNotebooks = user ? getNotebooksByUser(user.id) : [];

  const handleCreateNotebook = async () => {
    if (!user) return;

    if (!canCreateNotebook(user, notebooks)) {
      Alert.alert('Limite atingido', getLimitMessage('notebook'));
      return;
    }

    if (!title.trim()) {
      Alert.alert('Erro', 'Título é obrigatório');
      return;
    }

    setLoading(true);
    try {
      const colors = canCustomizeColors(user) ? { backgroundColor, titleColor } : undefined;
      await createNotebook(title, colors);
      setModalVisible(false);
      setTitle('');
      setBackgroundColor(theme.surface);
      setTitleColor(theme.text);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar caderno');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotebook = (notebook: Notebook) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja excluir o caderno "${notebook.title}"? Todas as matérias e folhas serão perdidas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteNotebook(notebook.id),
        },
      ]
    );
  };

  const renderNotebook = ({ item }: { item: Notebook }) => (
    <Card
      onPress={() => navigation.navigate('SubjectsList', { notebookId: item.id })}
      backgroundColor={item.colors?.backgroundColor}
    >
      <View style={styles.notebookHeader}>
        <Text
          style={[
            styles.notebookTitle,
            { color: item.colors?.titleColor || theme.text },
          ]}
        >
          {item.title}
        </Text>
        <Ionicons
          name="trash-outline"
          size={20}
          color={theme.error}
          onPress={() => handleDeleteNotebook(item)}
        />
      </View>
      <Text style={styles.notebookDate}>
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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    premiumContainer: {
      alignItems: 'center',
    },
    notebookHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    notebookTitle: {
      fontSize: 18,
      fontWeight: '600',
      flex: 1,
    },
    notebookDate: {
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meus Cadernos</Text>
          {user?.isPremium && (
            <View style={styles.premiumContainer}>
              <PremiumBadge size="small" />
            </View>
          )}
        </View>

        {userNotebooks.length === 0 ? (
          <EmptyState
            icon="book-outline"
            title="Nenhum caderno encontrado"
            message="Crie seu primeiro caderno para começar a organizar seus estudos com o método Cornell."
            actionTitle="Criar caderno"
            onAction={() => setModalVisible(true)}
          />
        ) : (
          <FlatList
            data={userNotebooks}
            renderItem={renderNotebook}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}

        <Button
          title="Novo Caderno"
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
            <Text style={styles.modalTitle}>Novo Caderno</Text>

            <Input
              label="Título"
              value={title}
              onChangeText={setTitle}
              placeholder="Digite o título do caderno"
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
                onPress={handleCreateNotebook}
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
