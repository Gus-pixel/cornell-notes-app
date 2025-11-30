import { User, Notebook, Subject, CornellSheet, NON_PREMIUM_LIMITS } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const canCreateNotebook = (user: User, notebooks: Notebook[]): boolean => {
  if (user.isPremium) return true;
  
  const userNotebooks = notebooks.filter(nb => nb.userId === user.id);
  return userNotebooks.length < NON_PREMIUM_LIMITS.MAX_NOTEBOOKS;
};

export const canCreateSubject = (user: User, subjects: Subject[], notebookId: string): boolean => {
  if (user.isPremium) return true;
  
  const notebookSubjects = subjects.filter(sub => sub.notebookId === notebookId);
  return notebookSubjects.length < NON_PREMIUM_LIMITS.MAX_SUBJECTS_PER_NOTEBOOK;
};

export const canCreateSheet = (user: User, sheets: CornellSheet[], subjectId: string): boolean => {
  if (user.isPremium) return true;
  
  const subjectSheets = sheets.filter(sheet => sheet.subjectId === subjectId);
  return subjectSheets.length < NON_PREMIUM_LIMITS.MAX_SHEETS_PER_SUBJECT;
};

export const canCustomizeColors = (user: User): boolean => {
  return user.isPremium;
};

export const canUseAdvancedSearch = (user: User): boolean => {
  return user.isPremium;
};

export const getLimitMessage = (type: 'notebook' | 'subject' | 'sheet'): string => {
  switch (type) {
    case 'notebook':
      return `Usuários não premium podem criar apenas ${NON_PREMIUM_LIMITS.MAX_NOTEBOOKS} caderno. Upgrade para premium para criar mais cadernos.`;
    case 'subject':
      return `Usuários não premium podem criar apenas ${NON_PREMIUM_LIMITS.MAX_SUBJECTS_PER_NOTEBOOK} matéria por caderno. Upgrade para premium para criar mais matérias.`;
    case 'sheet':
      return `Usuários não premium podem criar apenas ${NON_PREMIUM_LIMITS.MAX_SHEETS_PER_SUBJECT} folhas por matéria. Upgrade para premium para criar mais folhas.`;
    default:
      return 'Limite atingido. Upgrade para premium para ter acesso ilimitado.';
  }
};
