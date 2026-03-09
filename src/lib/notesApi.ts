import { api } from './api';

export interface Page {
  id: string;
  title: string;
  icon: string;
  blocks: Block[];
  subjectId?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Block {
  id: string;
  type: string;
  content: string;
  properties?: Record<string, unknown>;
  checked?: boolean;
}

export const notesApi = {
  getAll: () => api.get<Page[]>('/pages'),

  getById: (id: string) => api.get<Page>(`/pages/${id}`),

  create: (data: { title?: string; icon?: string; subjectId?: string; parentId?: string }) =>
    api.post<Page>('/pages', data),

  update: (id: string, data: Partial<{ title: string; icon: string; subjectId: string; parentId: string }>) =>
    api.put<Page>(`/pages/${id}`, data),

  delete: (id: string) => api.delete<void>(`/pages/${id}`),

  getBlocks: (pageId: string) => api.get<Block[]>(`/pages/${pageId}/blocks`),

  createBlock: (
    pageId: string,
    data: { type?: string; content?: string; afterBlockId?: string }
  ) => api.post<Block>(`/pages/${pageId}/blocks`, data),

  updateBlock: (
    pageId: string,
    blockId: string,
    data: Partial<{ content: string; type: string; properties: unknown; checked: boolean }>
  ) => api.put<Block>(`/pages/${pageId}/blocks/${blockId}`, data),

  deleteBlock: (pageId: string, blockId: string) =>
    api.delete<void>(`/pages/${pageId}/blocks/${blockId}`),
};
