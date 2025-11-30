import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, CornellSheet } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button, Input, ColorPicker, LoadingSpinner } from '../components';
import { canCustomizeColors } from '../utils/validation';

type Props = NativeStackScreenProps<HomeStackParamList, 'SheetEditor'>;

export const SheetEditorScreen: React.FC<Props> = ({ navigation, route }) => {
  const { sheetId, subjectId } = route.params;
  const { user } = useAuth();
  const { sheets, createSheet, updateSheet } = useData();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [sheet, setSheet] = useState<CornellSheet | null>(null);
  const [title, setTitle] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newNote, setNewNote] = useState('');
  const [colorsModalVisible, setColorsModalVisible] = useState(false);
  
  // Colors
  const [backgroundColor, setBackgroundColor] = useState(theme.surface);
  const [titleColor, setTitleColor] = useState(theme.text);
  const [topicsColor, setTopicsColor] = useState(theme.primary);
  const [notesColor, setNotesColor] = useState(theme.text);
  const [summaryColor, setSummaryColor] = useState(theme.textSecondary);

  useEffect(() => {
    if (sheetId) {
      const existingSheet = sheets.find(s => s.id === sheetId);
      if (existingSheet) {
        setSheet(existingSheet);
        setTitle(existingSheet.title);
        setTopics(existingSheet.topics);
        setNotes(existingSheet.notes);
        setSummary(existingSheet.summary);
        
        if (existingSheet.colors) {
          setBackgroundColor(existingSheet.colors.backgroundColor || theme.surface);
          setTitleColor(existingSheet.colors.titleColor || theme.text);
          setTopicsColor(existingSheet.colors.topicsColor || theme.primary);
          setNotesColor(existingSheet.colors.notesColor || theme.text);
          setSummaryColor(existingSheet.colors.summaryColor || theme.textSecondary);
        }
      }
    }
  }, [sheetId, sheets]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Título é obrigatório');
      return;
    }

    setLoading(true);
    try {
      const colors = canCustomizeColors(user!) ? {
        backgroundColor,
        titleColor,
        topicsColor,
        notesColor,
        summaryColor,
      } : undefined;

      if (sheetId && sheet) {
        await updateSheet(sheetId, {
          title,
          topics,
          notes,
          summary,
          colors,
        });
      } else {
        await createSheet(title, subjectId, colors);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar folha');
    } finally {
      setLoading(false);
    }
  };

  const addTopic = () => {
    if (newTopic.trim()) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
    }
  };

  const removeNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
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
    titleInput: {
      fontSize: 24,
      fontWeight: 'bold',
      color: titleColor,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      paddingVertical: 8,
      marginBottom: 24,
    },
    cornellContainer: {
      flex: 1,
      flexDirection: 'row',
      gap: 16,
    },
    topicsSection: {
      flex: 1,
    },
    notesSection: {
      flex: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
    },
    topicsSectionTitle: {
      color: topicsColor,
    },
    notesSectionTitle: {
      color: notesColor,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    itemText: {
      flex: 1,
      fontSize: 14,
    },
    topicText: {
      color: topicsColor,
    },
    noteText: {
      color: notesColor,
    },
    addContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    addInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginRight: 8,
      fontSize: 14,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.primary,
      borderRadius: 8,
      padding: 8,
    },
    summarySection: {
      marginTop: 24,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: summaryColor,
      marginBottom: 12,
    },
    summaryInput: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: summaryColor,
      minHeight: 80,
      textAlignVertical: 'top',
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
      maxHeight: '80%',
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

  if (loading && !sheet && sheetId) {
    return <LoadingSpinner message="Carregando folha..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Button
            title="Salvar"
            onPress={handleSave}
            disabled={loading}
          />
          {canCustomizeColors(user!) && (
            <TouchableOpacity onPress={() => setColorsModalVisible(true)}>
              <Ionicons name="color-palette" size={24} color={theme.primary} />
            </TouchableOpacity>
          )}
        </View>

        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Título da folha"
          placeholderTextColor={theme.textSecondary}
        />

        <View style={styles.cornellContainer}>
          {/* Topics Section */}
          <View style={styles.topicsSection}>
            <Text style={[styles.sectionTitle, styles.topicsSectionTitle]}>
              Tópicos
            </Text>
            
            <View style={styles.addContainer}>
              <TextInput
                style={styles.addInput}
                value={newTopic}
                onChangeText={setNewTopic}
                placeholder="Novo tópico"
                placeholderTextColor={theme.textSecondary}
                onSubmitEditing={addTopic}
              />
              <TouchableOpacity style={styles.addButton} onPress={addTopic}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {topics.map((topic, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={[styles.itemText, styles.topicText]}>
                  {topic}
                </Text>
                <TouchableOpacity onPress={() => removeTopic(index)}>
                  <Ionicons name="close" size={16} color={theme.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Notes Section */}
          <View style={styles.notesSection}>
            <Text style={[styles.sectionTitle, styles.notesSectionTitle]}>
              Anotações
            </Text>
            
            <View style={styles.addContainer}>
              <TextInput
                style={styles.addInput}
                value={newNote}
                onChangeText={setNewNote}
                placeholder="Nova anotação"
                placeholderTextColor={theme.textSecondary}
                onSubmitEditing={addNote}
                multiline
              />
              <TouchableOpacity style={styles.addButton} onPress={addNote}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {notes.map((note, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={[styles.itemText, styles.noteText]}>
                  {note}
                </Text>
                <TouchableOpacity onPress={() => removeNote(index)}>
                  <Ionicons name="close" size={16} color={theme.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Resumo</Text>
          <TextInput
            style={styles.summaryInput}
            value={summary}
            onChangeText={setSummary}
            placeholder="Escreva um resumo dos principais pontos..."
            placeholderTextColor={theme.textSecondary}
            multiline
          />
        </View>
      </ScrollView>

      {/* Colors Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={colorsModalVisible}
        onRequestClose={() => setColorsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Personalizar Cores</Text>

            <ColorPicker
              label="Cor de fundo"
              selectedColor={backgroundColor}
              onColorSelect={setBackgroundColor}
            />

            <ColorPicker
              label="Cor do título"
              selectedColor={titleColor}
              onColorSelect={setTitleColor}
            />

            <ColorPicker
              label="Cor dos tópicos"
              selectedColor={topicsColor}
              onColorSelect={setTopicsColor}
            />

            <ColorPicker
              label="Cor das anotações"
              selectedColor={notesColor}
              onColorSelect={setNotesColor}
            />

            <ColorPicker
              label="Cor do resumo"
              selectedColor={summaryColor}
              onColorSelect={setSummaryColor}
            />

            <View style={styles.modalButtons}>
              <Button
                title="Fechar"
                onPress={() => setColorsModalVisible(false)}
                style={styles.modalButton}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
