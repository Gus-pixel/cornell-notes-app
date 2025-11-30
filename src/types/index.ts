export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  createdAt: Date;
}

export interface NotebookColors {
  backgroundColor: string;
  titleColor: string;
}

export interface Notebook {
  id: string;
  title: string;
  userId: string;
  colors?: NotebookColors;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubjectColors {
  backgroundColor: string;
  titleColor: string;
}

export interface Subject {
  id: string;
  title: string;
  notebookId: string;
  colors?: SubjectColors;
  createdAt: Date;
  updatedAt: Date;
}

export interface CornellSheetColors {
  backgroundColor: string;
  titleColor: string;
  topicsColor: string;
  notesColor: string;
  summaryColor: string;
}

export interface CornellSheet {
  id: string;
  title: string;
  subjectId: string;
  topics: string[];
  notes: string[];
  summary: string;
  colors?: CornellSheetColors;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResult {
  type: 'notebook' | 'subject' | 'sheet';
  item: Notebook | Subject | CornellSheet;
  matchedText: string;
}

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface AppState {
  notebooks: Notebook[];
  subjects: Subject[];
  sheets: CornellSheet[];
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  NotebooksList: undefined;
  SubjectsList: { notebookId: string };
  SheetsList: { subjectId: string };
  SheetEditor: { sheetId?: string; subjectId: string };
};

// Limits for non-premium users
export const NON_PREMIUM_LIMITS = {
  MAX_NOTEBOOKS: 1,
  MAX_SUBJECTS_PER_NOTEBOOK: 1,
  MAX_SHEETS_PER_SUBJECT: 3,
} as const;
