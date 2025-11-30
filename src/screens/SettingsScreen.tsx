import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button, Card, Input, PremiumBadge } from '../components';
import { validateName } from '../utils/validation';

export const SettingsScreen: React.FC = () => {
  const { user, updateUser, signOut } = useAuth();
  const { theme, setCustomTheme, resetTheme } = useTheme();
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleTogglePremium = async () => {
    if (!user) return;

    try {
      await updateUser({ isPremium: !user.isPremium });
      Alert.alert(
        'Sucesso',
        user.isPremium 
          ? 'Você foi rebaixado para a versão gratuita' 
          : 'Parabéns! Você agora é um usuário premium!'
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao alterar status premium');
    }
  };

  const handleUpdateName = async () => {
    if (!validateName(newName)) {
      Alert.alert('Erro', 'Nome deve ter pelo menos 2 caracteres');
      return;
    }

    setLoading(true);
    try {
      await updateUser({ name: newName });
      setNameModalVisible(false);
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar nome');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Confirmar logout',
      'Deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
    },
    userInfo: {
      alignItems: 'center',
      marginBottom: 16,
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: theme.surface,
      borderRadius: 12,
      marginBottom: 8,
    },
    settingLeft: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.text,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    premiumSetting: {
      backgroundColor: '#FFF8E1',
      borderWidth: 1,
      borderColor: '#FFD700',
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
    dangerButton: {
      backgroundColor: theme.error,
      marginTop: 32,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.section}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            {user?.isPremium && <PremiumBadge />}
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          
          <Card style={styles.settingItem} onPress={() => setNameModalVisible(true)}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Alterar Nome</Text>
              <Text style={styles.settingDescription}>
                Atualize seu nome de exibição
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </Card>

          <Card 
            style={[
              styles.settingItem, 
              user?.isPremium && styles.premiumSetting
            ]}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>
                Status Premium {user?.isPremium && '⭐'}
              </Text>
              <Text style={styles.settingDescription}>
                {user?.isPremium 
                  ? 'Você tem acesso a todos os recursos premium'
                  : 'Ative para ter acesso ilimitado e personalização'
                }
              </Text>
            </View>
            <Switch
              value={user?.isPremium || false}
              onValueChange={handleTogglePremium}
              trackColor={{ false: theme.border, true: '#FFD700' }}
              thumbColor={user?.isPremium ? '#FFA000' : theme.textSecondary}
            />
          </Card>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aplicativo</Text>
          
          {user?.isPremium && (
            <Card style={styles.settingItem} onPress={resetTheme}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>Resetar Tema</Text>
                <Text style={styles.settingDescription}>
                  Voltar ao tema padrão premium
                </Text>
              </View>
              <Ionicons name="color-palette" size={20} color={theme.primary} />
            </Card>
          )}
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          
          <Card style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Cornell Notes</Text>
              <Text style={styles.settingDescription}>
                Versão 1.0.0 - Organize seus estudos com o método Cornell
              </Text>
            </View>
          </Card>
        </View>

        {/* Logout */}
        <Button
          title="Sair da Conta"
          onPress={handleSignOut}
          variant="outline"
          style={styles.dangerButton}
          textStyle={{ color: theme.error }}
        />
      </ScrollView>

      {/* Name Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={nameModalVisible}
        onRequestClose={() => setNameModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar Nome</Text>

            <Input
              label="Novo nome"
              value={newName}
              onChangeText={setNewName}
              placeholder="Digite seu novo nome"
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setNameModalVisible(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title={loading ? 'Salvando...' : 'Salvar'}
                onPress={handleUpdateName}
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
