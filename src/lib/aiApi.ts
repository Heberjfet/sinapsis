import { api } from './api';

export interface GeneratedFlashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export const aiApi = {
  generateFlashcards: (topic: string, count: number = 5) =>
    api.post<{ flashcards: GeneratedFlashcard[] }>('/ai/flashcards', { topic, count }),

  generateSummary: (content: string) =>
    api.post<{ summary: string }>('/ai/summary', { content }),

  generateQuiz: (content: string, count: number = 5) =>
    api.post<{ questions: QuizQuestion[] }>('/ai/quiz', { content, count }),

  generateStudyPlan: (topic: string, days: number = 7) =>
    api.post<{ plan: string }>('/ai/study-plan', { topic, days }),

  explainConcept: (concept: string) =>
    api.post<{ explanation: string }>('/ai/explain', { concept }),
};
