import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Notebook, Subject, CornellSheet } from '../types';

const STORAGE_KEYS = {
  USER: '@cornell_notes_user',
  NOTEBOOKS: '@cornell_notes_notebooks',
  SUBJECTS: '@cornell_notes_subjects',
  SHEETS: '@cornell_notes_sheets',
} as const;

// User storage
export const saveUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (userData) {
      const user = JSON.parse(userData);
      // Convert date strings back to Date objects
      user.createdAt = new Date(user.createdAt);
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error removing user:', error);
    throw error;
  }
};

// Notebooks storage
export const saveNotebooks = async (notebooks: Notebook[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.NOTEBOOKS, JSON.stringify(notebooks));
  } catch (error) {
    console.error('Error saving notebooks:', error);
    throw error;
  }
};

export const getNotebooks = async (): Promise<Notebook[]> => {
  try {
    const notebooksData = await AsyncStorage.getItem(STORAGE_KEYS.NOTEBOOKS);
    if (notebooksData) {
      const notebooks = JSON.parse(notebooksData);
      // Convert date strings back to Date objects
      return notebooks.map((notebook: any) => ({
        ...notebook,
        createdAt: new Date(notebook.createdAt),
        updatedAt: new Date(notebook.updatedAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting notebooks:', error);
    return [];
  }
};

// Subjects storage
export const saveSubjects = async (subjects: Subject[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  } catch (error) {
    console.error('Error saving subjects:', error);
    throw error;
  }
};

export const getSubjects = async (): Promise<Subject[]> => {
  try {
    const subjectsData = await AsyncStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (subjectsData) {
      const subjects = JSON.parse(subjectsData);
      return subjects.map((subject: any) => ({
        ...subject,
        createdAt: new Date(subject.createdAt),
        updatedAt: new Date(subject.updatedAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting subjects:', error);
    return [];
  }
};

// Sheets storage
export const saveSheets = async (sheets: CornellSheet[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SHEETS, JSON.stringify(sheets));
  } catch (error) {
    console.error('Error saving sheets:', error);
    throw error;
  }
};

export const getSheets = async (): Promise<CornellSheet[]> => {
  try {
    const sheetsData = await AsyncStorage.getItem(STORAGE_KEYS.SHEETS);
    if (sheetsData) {
      const sheets = JSON.parse(sheetsData);
      return sheets.map((sheet: any) => ({
        ...sheet,
        createdAt: new Date(sheet.createdAt),
        updatedAt: new Date(sheet.updatedAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting sheets:', error);
    return [];
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER,
      STORAGE_KEYS.NOTEBOOKS,
      STORAGE_KEYS.SUBJECTS,
      STORAGE_KEYS.SHEETS,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};
