export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  color: NoteColor;
  isPinned: boolean;
  isLocked: boolean;
  category: NoteCategory;
}

export enum NoteCategory {
  ALL = 'All',
  PERSONAL = 'Personal',
  WORK = 'Work',
  IDEAS = 'Ideas',
  TO_DO = 'To-Do'
}

export enum NoteColor {
  DEFAULT = 'bg-white',
  RED = 'bg-rose-100',
  ORANGE = 'bg-orange-100',
  YELLOW = 'bg-amber-100',
  GREEN = 'bg-emerald-100',
  CYAN = 'bg-cyan-100',
  BLUE = 'bg-blue-100',
  PURPLE = 'bg-purple-100',
  PINK = 'bg-pink-100',
}

export type ViewMode = 'grid' | 'list';
export type AIActionType = 'summarize' | 'fix_grammar' | 'continue';
