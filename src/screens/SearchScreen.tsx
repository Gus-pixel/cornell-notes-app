import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SearchResult } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { Input, Card, EmptyState } from '../components';
import { canUseAdvancedSearch } from '../utils/validation';

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { searchContent } = useData();
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length >= 2) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query]);

  const performSearch = async () => {
    if (!canUseAdvancedSearch(user!)) return;

    setLoading(true);
    try {
      const searchResults = searchContent(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'notebook':
        return 'book';
      case 'subject':
        return 'library';
      case 'sheet':
        return 'document-text';
      default:
        return 'search';
    }
  };

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'notebook':
        return 'Caderno';
      case 'subject':
        return 'Matéria';
      case 'sheet':
        return 'Folha';
      default:
        return 'Item';
    }
  };

  const handleResultPress = (result: SearchResult) => {
    // Navigate to the appropriate screen based on result type
    // This would require more complex navigation logic
    console.log('Navigate to result:', result);
  };

  const renderResult = ({ item }: { item: SearchResult }) => (
    <Card onPress={() => handleResultPress(item)}>
      <View style={styles.resultHeader}>
        <View style={styles.resultIconContainer}>
          <Ionicons
            name={getResultIcon(item.type) as any}
            size={20}
            color={theme.primary}
          />
          <Text style={styles.resultType}>
            {getResultTypeLabel(item.type)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.resultTitle}>
        {item.item.title}
      </Text>
      
      <Text style={styles.resultMatch} numberOfLines={2}>
        Encontrado: "{item.matchedText}"
      </Text>
      
      <Text style={styles.resultDate}>
        Atualizado em {item.item.updatedAt.toLocaleDateString()}
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
    searchContainer: {
      marginBottom: 16,
    },
    resultHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    resultIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    resultType: {
      fontSize: 12,
      color: theme.primary,
      fontWeight: '600',
      marginLeft: 4,
      textTransform: 'uppercase',
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    resultMatch: {
      fontSize: 14,
      color: theme.textSecondary,
      fontStyle: 'italic',
      marginBottom: 4,
    },
    resultDate: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    resultsCount: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 16,
      textAlign: 'center',
    },
  });

  if (!canUseAdvancedSearch(user!)) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="search-outline"
          title="Busca Premium"
          message="A busca avançada está disponível apenas para usuários premium. Upgrade sua conta para pesquisar em todos os seus cadernos, matérias e folhas."
          actionTitle="Ir para Configurações"
          onAction={() => navigation.navigate('Settings' as never)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Pesquisar em cadernos, matérias e folhas..."
            value={query}
            onChangeText={setQuery}
            style={{ marginBottom: 0 }}
          />
        </View>

        {query.trim().length >= 2 && (
          <Text style={styles.resultsCount}>
            {results.length} resultado(s) encontrado(s)
          </Text>
        )}

        {query.trim().length === 0 ? (
          <EmptyState
            icon="search-outline"
            title="Busca Avançada"
            message="Digite pelo menos 2 caracteres para começar a pesquisar em todos os seus conteúdos."
          />
        ) : query.trim().length < 2 ? (
          <EmptyState
            icon="search-outline"
            title="Continue digitando..."
            message="Digite mais caracteres para refinar sua busca."
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title="Nenhum resultado encontrado"
            message={`Não encontramos nada para "${query}". Tente usar outras palavras-chave.`}
          />
        ) : (
          <FlatList
            data={results}
            renderItem={renderResult}
            keyExtractor={(item, index) => `${item.type}-${item.item.id}-${index}`}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
