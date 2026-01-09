import { Note } from '../types';

const STORAGE_KEY = 'material_notes_m3_data';
const PIN_KEY = 'material_notes_m3_pin';

export const getNotes = (): Note[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load notes", e);
    return [];
  }
};

export const saveNotes = (notes: Note[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error("Failed to save notes", e);
  }
};

export const getMasterPin = (): string | null => {
  return localStorage.getItem(PIN_KEY);
};

export const saveMasterPin = (pin: string) => {
  localStorage.setItem(PIN_KEY, pin);
};

export const hasMasterPin = (): boolean => {
  return !!localStorage.getItem(PIN_KEY);
};
