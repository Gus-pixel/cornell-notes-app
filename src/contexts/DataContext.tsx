import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Notebook, Subject, CornellSheet, SearchResult } from '../types';
import { saveNotebooks, getNotebooks, saveSubjects, getSubjects, saveSheets, getSheets } from '../utils/storage';
import { useAuth } from './AuthContext';

interface DataContextData {
  notebooks: Notebook[];
  subjects: Subject[];
  sheets: CornellSheet[];
  loading: boolean;
  
  // Notebook operations
  createNotebook: (title: string, colors?: any) => Promise<Notebook>;
  updateNotebook: (id: string, updates: Partial<Notebook>) => Promise<void>;
  deleteNotebook: (id: string) => Promise<void>;
  
  // Subject operations
  createSubject: (title: string, notebookId: string, colors?: any) => Promise<Subject>;
  updateSubject: (id: string, updates: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  
  // Sheet operations
  createSheet: (title: string, subjectId: string, colors?: any) => Promise<CornellSheet>;
  updateSheet: (id: string, updates: Partial<CornellSheet>) => Promise<void>;
  deleteSheet: (id: string) => Promise<void>;
  
  // Search
  searchContent: (query: string) => SearchResult[];
  
  // Getters
  getNotebooksByUser: (userId: string) => Notebook[];
  getSubjectsByNotebook: (notebookId: string) => Subject[];
  getSheetsBySubject: (subjectId: string) => CornellSheet[];
}

const DataContext = createContext<DataContextData>({} as DataContextData);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sheets, setSheets] = useState<CornellSheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [loadedNotebooks, loadedSubjects, loadedSheets] = await Promise.all([
        getNotebooks(),
        getSubjects(),
        getSheets(),
      ]);

      setNotebooks(loadedNotebooks);
      setSubjects(loadedSubjects);
      setSheets(loadedSheets);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Notebook operations
  const createNotebook = async (title: string, colors?: any): Promise<Notebook> => {
    if (!user) throw new Error('Usuário não autenticado');

    const newNotebook: Notebook = {
      id: Date.now().toString(),
      title,
      userId: user.id,
      colors,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedNotebooks = [...notebooks, newNotebook];
    setNotebooks(updatedNotebooks);
    await saveNotebooks(updatedNotebooks);

    return newNotebook;
  };

  const updateNotebook = async (id: string, updates: Partial<Notebook>): Promise<void> => {
    const updatedNotebooks = notebooks.map(notebook =>
      notebook.id === id
        ? { ...notebook, ...updates, updatedAt: new Date() }
        : notebook
    );

    setNotebooks(updatedNotebooks);
    await saveNotebooks(updatedNotebooks);
  };

  const deleteNotebook = async (id: string): Promise<void> => {
    // Delete related subjects and sheets
    const relatedSubjects = subjects.filter(subject => subject.notebookId === id);
    const relatedSubjectIds = relatedSubjects.map(subject => subject.id);
    const relatedSheets = sheets.filter(sheet => relatedSubjectIds.includes(sheet.subjectId));

    const updatedNotebooks = notebooks.filter(notebook => notebook.id !== id);
    const updatedSubjects = subjects.filter(subject => subject.notebookId !== id);
    const updatedSheets = sheets.filter(sheet => !relatedSubjectIds.includes(sheet.subjectId));

    setNotebooks(updatedNotebooks);
    setSubjects(updatedSubjects);
    setSheets(updatedSheets);

    await Promise.all([
      saveNotebooks(updatedNotebooks),
      saveSubjects(updatedSubjects),
      saveSheets(updatedSheets),
    ]);
  };

  // Subject operations
  const createSubject = async (title: string, notebookId: string, colors?: any): Promise<Subject> => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      title,
      notebookId,
      colors,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    await saveSubjects(updatedSubjects);

    return newSubject;
  };

  const updateSubject = async (id: string, updates: Partial<Subject>): Promise<void> => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === id
        ? { ...subject, ...updates, updatedAt: new Date() }
        : subject
    );

    setSubjects(updatedSubjects);
    await saveSubjects(updatedSubjects);
  };

  const deleteSubject = async (id: string): Promise<void> => {
    // Delete related sheets
    const updatedSubjects = subjects.filter(subject => subject.id !== id);
    const updatedSheets = sheets.filter(sheet => sheet.subjectId !== id);

    setSubjects(updatedSubjects);
    setSheets(updatedSheets);

    await Promise.all([
      saveSubjects(updatedSubjects),
      saveSheets(updatedSheets),
    ]);
  };

  // Sheet operations
  const createSheet = async (title: string, subjectId: string, colors?: any): Promise<CornellSheet> => {
    const newSheet: CornellSheet = {
      id: Date.now().toString(),
      title,
      subjectId,
      topics: [],
      notes: [],
      summary: '',
      colors,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedSheets = [...sheets, newSheet];
    setSheets(updatedSheets);
    await saveSheets(updatedSheets);

    return newSheet;
  };

  const updateSheet = async (id: string, updates: Partial<CornellSheet>): Promise<void> => {
    const updatedSheets = sheets.map(sheet =>
      sheet.id === id
        ? { ...sheet, ...updates, updatedAt: new Date() }
        : sheet
    );

    setSheets(updatedSheets);
    await saveSheets(updatedSheets);
  };

  const deleteSheet = async (id: string): Promise<void> => {
    const updatedSheets = sheets.filter(sheet => sheet.id !== id);
    setSheets(updatedSheets);
    await saveSheets(updatedSheets);
  };

  // Search functionality
  const searchContent = (query: string): SearchResult[] => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search notebooks
    notebooks.forEach(notebook => {
      if (notebook.title.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'notebook',
          item: notebook,
          matchedText: notebook.title,
        });
      }
    });

    // Search subjects
    subjects.forEach(subject => {
      if (subject.title.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'subject',
          item: subject,
          matchedText: subject.title,
        });
      }
    });

    // Search sheets
    sheets.forEach(sheet => {
      const searchFields = [
        sheet.title,
        ...sheet.topics,
        ...sheet.notes,
        sheet.summary,
      ];

      searchFields.forEach(field => {
        if (field.toLowerCase().includes(searchTerm)) {
          results.push({
            type: 'sheet',
            item: sheet,
            matchedText: field,
          });
        }
      });
    });

    return results;
  };

  // Getters
  const getNotebooksByUser = (userId: string): Notebook[] => {
    return notebooks.filter(notebook => notebook.userId === userId);
  };

  const getSubjectsByNotebook = (notebookId: string): Subject[] => {
    return subjects.filter(subject => subject.notebookId === notebookId);
  };

  const getSheetsBySubject = (subjectId: string): CornellSheet[] => {
    return sheets.filter(sheet => sheet.subjectId === subjectId);
  };

  return (
    <DataContext.Provider
      value={{
        notebooks,
        subjects,
        sheets,
        loading,
        createNotebook,
        updateNotebook,
        deleteNotebook,
        createSubject,
        updateSubject,
        deleteSubject,
        createSheet,
        updateSheet,
        deleteSheet,
        searchContent,
        getNotebooksByUser,
        getSubjectsByNotebook,
        getSheetsBySubject,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextData => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
