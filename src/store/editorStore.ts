import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Page, Block, BlockType } from '../types/editor';

interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  subjectId?: string;
  nextReview?: number;
  easeFactor: number;
  interval: number;
  repetitions: number;
}

interface PomodoroSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration: number;
  type: 'focus' | 'short-break' | 'long-break';
  completed: boolean;
  subjectId?: string;
}

interface StudyStats {
  totalMinutes: number;
  sessionsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate?: string;
}

interface EditorState {
  // Navigation
  activeView: 'notes' | 'flashcards' | 'dashboard' | 'settings';
  setActiveView: (view: 'notes' | 'flashcards' | 'dashboard' | 'settings') => void;

  // Sidebar & Panels
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  rightPanelTab: 'ai' | 'pomodoro' | 'music';
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  setRightPanelTab: (tab: 'ai' | 'pomodoro' | 'music') => void;

  // Pages & Blocks
  pages: Page[];
  currentPageId: string | null;
  subjects: Subject[];

  // Page actions
  createPage: (subjectId?: string | null) => string;
  deletePage: (id: string) => void;
  updatePageTitle: (id: string, title: string) => void;
  updatePageSubject: (id: string, subjectId: string) => void;
  setCurrentPage: (id: string | null) => void;
  lastCreatedPageId: string | null;
  consumeLastCreatedPage: () => void;

  // Block actions
  addBlock: (pageId: string, afterBlockId?: string | null) => string;
  updateBlock: (pageId: string, blockId: string, content: string) => void;
  updateBlockType: (pageId: string, blockId: string, type: BlockType) => void;
  updateBlockProperties: (pageId: string, blockId: string, properties: Record<string, any>) => void;
  deleteBlock: (pageId: string, blockId: string) => void;
  reorderBlocks: (pageId: string, activeId: string, overId: string) => void;
  toggleTodo: (pageId: string, blockId: string) => void;

  // Subject actions
  createSubject: (name: string, color: string, icon: string) => void;
  deleteSubject: (id: string) => void;

  // Flashcards
  flashcards: Flashcard[];
  addFlashcard: (front: string, back: string, subjectId?: string) => void;
  updateFlashcard: (id: string, front: string, back: string) => void;
  deleteFlashcard: (id: string) => void;
  reviewFlashcard: (id: string, quality: number) => void;

  // Flashcards Navigation
  currentFlashcardTheme: string | null;
  studyingFlashcardId: string | null;
  showCreateThemeModal: boolean;
  setCurrentFlashcardTheme: (themeId: string | null) => void;
  setStudyingFlashcardId: (id: string | null) => void;
  setShowCreateThemeModal: (show: boolean) => void;

  // Pomodoro
  pomodoroActive: boolean;
  pomodoroType: 'focus' | 'short-break' | 'long-break';
  pomodoroTimeRemaining: number;
  pomodoroSettings: {
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsBeforeLongBreak: number;
  };
  pomodoroSessions: PomodoroSession[];
  currentSessionId: string | null;
  startPomodoro: (type?: 'focus' | 'short-break' | 'long-break') => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  tickPomodoro: () => void;
  completePomodoro: () => void;

  // Study Stats
  stats: StudyStats;
  updateStats: () => void;

  // Command Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Get current page
  getCurrentPage: () => Page | undefined;
}

const createDefaultPage = (): Page => ({
  id: uuidv4(),
  title: 'Bienvenido a Sinapsis',
  icon: '🧠',
  blocks: [
    {
      id: uuidv4(),
      type: 'h1',
      content: 'Bienvenido a Sinapsis',
    },
    {
      id: uuidv4(),
      type: 'text',
      content: 'Tu plataforma inteligente de estudio. Explora las funciones usando el menú de comandos (Ctrl+K).',
    },
    {
      id: uuidv4(),
      type: 'callout',
      content: '💡 Usa "/" para ver los comandos de bloques o Ctrl+K para búsqueda global',
    },
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'math', name: 'Matemáticas', color: '#A0C4FF', icon: '📐' },
  { id: 'science', name: 'Ciencias', color: '#CAFFBF', icon: '🔬' },
  { id: 'history', name: 'Historia', color: '#FFEEB5', icon: '📜' },
  { id: 'languages', name: 'Idiomas', color: '#FFD6FF', icon: '🌍' },
];

export const useEditorStore = create<EditorState>((set, get) => ({
  // Navigation
  activeView: 'notes',
  setActiveView: (view) => set({ activeView: view }),

  // Sidebar & Panels
  sidebarOpen: true,
  rightPanelOpen: false,
  rightPanelTab: 'ai',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab, rightPanelOpen: true }),

  // Pages
  pages: [createDefaultPage()],
  currentPageId: null,
  subjects: DEFAULT_SUBJECTS,
  lastCreatedPageId: null,
  consumeLastCreatedPage: () => set({ lastCreatedPageId: null }),

  createPage: (subjectId = null) => {
    const newPage: Page = {
      id: uuidv4(),
      title: 'Sin título',
      blocks: [
        {
          id: uuidv4(),
          type: 'text',
          content: '',
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((state) => ({
      pages: [...state.pages, newPage],
      currentPageId: newPage.id,
      lastCreatedPageId: newPage.id,
    }));

    return newPage.id;
  },

  deletePage: (id) => {
    set((state) => ({
      pages: state.pages.filter((page) => page.id !== id),
      currentPageId: state.currentPageId === id ? state.pages[0]?.id || null : state.currentPageId,
    }));
  },

  updatePageTitle: (id, title) => {
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === id ? { ...page, title, updatedAt: Date.now() } : page
      ),
    }));
  },

  updatePageSubject: (id, subjectId) => {
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === id ? { ...page, subjectId, updatedAt: Date.now() } : page
      ),
    }));
  },

  setCurrentPage: (id) => {
    set({ currentPageId: id });
  },

  addBlock: (pageId, afterBlockId = null) => {
    const newBlockId = uuidv4();

    set((state) => ({
      pages: state.pages.map((page) => {
        if (page.id !== pageId) return page;

        const newBlock: Block = {
          id: newBlockId,
          type: 'text',
          content: '',
        };

        const blocks = [...page.blocks];
        const afterIndex = afterBlockId
          ? blocks.findIndex((b) => b.id === afterBlockId)
          : blocks.length - 1;

        if (afterIndex >= 0) {
          blocks.splice(afterIndex + 1, 0, newBlock);
        } else {
          blocks.push(newBlock);
        }

        return { ...page, blocks, updatedAt: Date.now() };
      }),
    }));

    return newBlockId;
  },

  updateBlock: (pageId, blockId, content) => {
    set((state) => ({
      pages: state.pages.map((page) => {
        if (page.id !== pageId) return page;

        return {
          ...page,
          blocks: page.blocks.map((block) =>
            block.id === blockId ? { ...block, content } : block
          ),
          updatedAt: Date.now(),
        };
      }),
    }));
  },

  updateBlockType: (pageId, blockId, type) => {
    set((state) => ({
      pages: state.pages.map((page) => {
        if (page.id !== pageId) return page;

        return {
          ...page,
          blocks: page.blocks.map((block) =>
            block.id === blockId ? { ...block, type } : block
          ),
          updatedAt: Date.now(),
        };
      }),
    }));
  },

  updateBlockProperties: (pageId, blockId, properties) => {
    set((state) => ({
      pages: state.pages.map((page) => {
        if (page.id !== pageId) return page;

        return {
          ...page,
          blocks: page.blocks.map((block) =>
            block.id === blockId
              ? { ...block, properties: { ...block.properties, ...properties } }
              : block
          ),
          updatedAt: Date.now(),
        };
      }),
    }));
  },

  deleteBlock: (pageId, blockId) => {
    set((state) => ({
      pages: state.pages.map((page) => {
        if (page.id !== pageId) return page;

        const blocks = page.blocks.filter((block) => block.id !== blockId);
        return { ...page, blocks, updatedAt: Date.now() };
      }),
    }));
  },

  reorderBlocks: (pageId, activeId, overId) => {
    set((state) => ({
      pages: state.pages.map((page) => {
        if (page.id !== pageId) return page;

        const oldIndex = page.blocks.findIndex((b) => b.id === activeId);
        const newIndex = page.blocks.findIndex((b) => b.id === overId);

        if (oldIndex === -1 || newIndex === -1) return page;

        const blocks = [...page.blocks];
        const [removed] = blocks.splice(oldIndex, 1);
        blocks.splice(newIndex, 0, removed);

        return { ...page, blocks, updatedAt: Date.now() };
      }),
    }));
  },

  toggleTodo: (pageId, blockId) => {
    set((state) => ({
      pages: state.pages.map((page) => {
        if (page.id !== pageId) return page;

        return {
          ...page,
          blocks: page.blocks.map((block) =>
            block.id === blockId && block.type === 'todo'
              ? {
                ...block,
                properties: {
                  ...block.properties,
                  checked: !block.properties?.checked,
                },
              }
              : block
          ),
          updatedAt: Date.now(),
        };
      }),
    }));
  },

  // Subject actions
  createSubject: (name, color, icon) => {
    const newSubject: Subject = {
      id: uuidv4(),
      name,
      color,
      icon,
    };
    set((state) => ({ subjects: [...state.subjects, newSubject] }));
  },

  deleteSubject: (id) => {
    set((state) => ({
      subjects: state.subjects.filter((s) => s.id !== id),
      flashcards: state.flashcards.filter((card) => card.subjectId !== id),
      currentFlashcardTheme: state.currentFlashcardTheme === id ? null : state.currentFlashcardTheme,
    }));
  },

  // Flashcards
  flashcards: [
    {
      id: '1',
      front: '¿Qué es Sinapsis?',
      back: 'Una plataforma inteligente de estudio con IA, búsqueda semántica y herramientas de concentración.',
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
    },
    {
      id: '2',
      front: '¿Cuáles son los tipos de bloques disponibles?',
      back: 'Texto, Títulos, Listas, Tareas, Citas, Código, Tablas, Kanban y más.',
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
    },
  ],

  addFlashcard: (front, back, subjectId) => {
    const newCard: Flashcard = {
      id: uuidv4(),
      front,
      back,
      subjectId,
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
    };
    set((state) => ({ flashcards: [...state.flashcards, newCard] }));
  },

  updateFlashcard: (id, front, back) => {
    set((state) => ({
      flashcards: state.flashcards.map((card) =>
        card.id === id ? { ...card, front, back } : card
      ),
    }));
  },

  deleteFlashcard: (id) => {
    set((state) => ({
      flashcards: state.flashcards.filter((card) => card.id !== id),
    }));
  },

  reviewFlashcard: (id, quality) => {
    set((state) => ({
      flashcards: state.flashcards.map((card) => {
        if (card.id !== id) return card;

        let { easeFactor, interval, repetitions } = card;

        if (quality >= 3) {
          if (repetitions === 0) {
            interval = 1;
          } else if (repetitions === 1) {
            interval = 6;
          } else {
            interval = Math.round(interval * easeFactor);
          }
          repetitions += 1;
        } else {
          repetitions = 0;
          interval = 1;
        }

        easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

        return {
          ...card,
          easeFactor,
          interval,
          repetitions,
          nextReview: Date.now() + interval * 24 * 60 * 60 * 1000,
        };
      }),
    }));
  },

  // Flashcards Navigation
  currentFlashcardTheme: null,
  studyingFlashcardId: null,
  showCreateThemeModal: false,
  setCurrentFlashcardTheme: (themeId) => set({ currentFlashcardTheme: themeId }),
  setStudyingFlashcardId: (id) => set({ studyingFlashcardId: id }),
  setShowCreateThemeModal: (show) => set({ showCreateThemeModal: show }),

  // Pomodoro
  pomodoroActive: false,
  pomodoroType: 'focus',
  pomodoroTimeRemaining: 25 * 60,
  pomodoroSettings: {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
  },
  pomodoroSessions: [],
  currentSessionId: null,

  startPomodoro: (type) => {
    const settings = get().pomodoroSettings;
    const pomodoroType = type || 'focus';

    let duration: number;
    switch (pomodoroType) {
      case 'short-break':
        duration = settings.shortBreakDuration * 60;
        break;
      case 'long-break':
        duration = settings.longBreakDuration * 60;
        break;
      default:
        duration = settings.focusDuration * 60;
    }

    const session: PomodoroSession = {
      id: uuidv4(),
      startTime: Date.now(),
      duration: duration,
      type: pomodoroType,
      completed: false,
    };

    set({
      pomodoroActive: true,
      pomodoroType,
      pomodoroTimeRemaining: duration,
      currentSessionId: session.id,
      pomodoroSessions: [...get().pomodoroSessions, session],
    });
  },

  pausePomodoro: () => {
    set({ pomodoroActive: false });
  },

  resetPomodoro: () => {
    const settings = get().pomodoroSettings;
    set({
      pomodoroActive: false,
      pomodoroTimeRemaining: settings.focusDuration * 60,
      pomodoroType: 'focus',
      currentSessionId: null,
    });
  },

  tickPomodoro: () => {
    const { pomodoroTimeRemaining, pomodoroActive } = get();
    if (pomodoroActive && pomodoroTimeRemaining > 0) {
      set({ pomodoroTimeRemaining: pomodoroTimeRemaining - 1 });
    } else if (pomodoroTimeRemaining === 0) {
      get().completePomodoro();
    }
  },

  completePomodoro: () => {
    const { currentSessionId, pomodoroSessions, stats } = get();
    if (currentSessionId) {
      const updatedSessions = pomodoroSessions.map((session) =>
        session.id === currentSessionId
          ? { ...session, completed: true, endTime: Date.now() }
          : session
      );

      const today = new Date().toDateString();
      const isNewDay = stats.lastStudyDate !== today;

      set({
        pomodoroSessions: updatedSessions,
        pomodoroActive: false,
        stats: {
          totalMinutes: stats.totalMinutes + (get().pomodoroType === 'focus' ? get().pomodoroSettings.focusDuration : 0),
          sessionsCompleted: stats.sessionsCompleted + 1,
          currentStreak: isNewDay ? stats.currentStreak + 1 : stats.currentStreak,
          longestStreak: Math.max(stats.longestStreak, stats.currentStreak + (isNewDay ? 1 : 0)),
          lastStudyDate: today,
        },
      });
    }
  },

  // Stats
  stats: {
    totalMinutes: 1250,
    sessionsCompleted: 52,
    currentStreak: 5,
    longestStreak: 12,
  },

  updateStats: () => {
    // This would sync with backend in real app
  },

  // Command Palette
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  getCurrentPage: () => {
    const state = get();
    return state.pages.find((page) => page.id === state.currentPageId);
  },
}));

// Initialize current page on store creation
const initialPage = createDefaultPage();
useEditorStore.setState({
  currentPageId: initialPage.id,
  pages: [initialPage],
});
