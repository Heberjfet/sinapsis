export type BlockType =
  | 'text'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bullet-list'
  | 'numbered-list'
  | 'todo'
  | 'quote'
  | 'callout'
  | 'divider'
  | 'image'
  | 'code'
  | 'table'
  | 'kanban';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  properties?: {
    checked?: boolean;
    color?: string;
    url?: string;
    language?: string;
    tableData?: TableData;
    kanbanData?: KanbanData;
  };
  children?: Block[];
}

export interface TableData {
  rows: number;
  cols: number;
  headers: string[];
  cells: string[][];
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface KanbanCard {
  id: string;
  content: string;
}

export interface KanbanData {
  columns: KanbanColumn[];
}

export interface Page {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  blocks: Block[];
  subjectId?: string;
  parentId?: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface SlashCommand {
  id: string;
  label: string;
  description: string;
  icon: string;
  type: BlockType;
  keywords: string[];
}

export const SLASH_COMMANDS: SlashCommand[] = [
  {
    id: 'text',
    label: 'Texto',
    description: 'Texto simple',
    icon: 'Type',
    type: 'text',
    keywords: ['párrafo', 'texto', 'plain'],
  },
  {
    id: 'h1',
    label: 'Título 1',
    description: 'Título grande',
    icon: 'Heading1',
    type: 'h1',
    keywords: ['título', 'h1', 'heading'],
  },
  {
    id: 'h2',
    label: 'Título 2',
    description: 'Título medio',
    icon: 'Heading2',
    type: 'h2',
    keywords: ['título', 'h2', 'subheading'],
  },
  {
    id: 'h3',
    label: 'Título 3',
    description: 'Título pequeño',
    icon: 'Heading3',
    type: 'h3',
    keywords: ['título', 'h3', 'subheading'],
  },
  {
    id: 'bullet-list',
    label: 'Lista con viñetas',
    description: 'Lista con viñetas',
    icon: 'List',
    type: 'bullet-list',
    keywords: ['lista', 'viñetas', 'bullet', 'ul'],
  },
  {
    id: 'numbered-list',
    label: 'Lista numerada',
    description: 'Lista numerada',
    icon: 'ListOrdered',
    type: 'numbered-list',
    keywords: ['lista', 'números', 'ol', 'numbered'],
  },
  {
    id: 'todo',
    label: 'Tarea',
    description: 'Lista de tareas',
    icon: 'CheckSquare',
    type: 'todo',
    keywords: ['tarea', 'todo', 'check', 'checklist'],
  },
  {
    id: 'quote',
    label: 'Cita',
    description: 'Cita o bloque de verificación',
    icon: 'Quote',
    type: 'quote',
    keywords: ['cita', 'quote', 'blockquote'],
  },
  {
    id: 'callout',
    label: 'Nota',
    description: 'Nota destacada',
    icon: 'MessageSquare',
    type: 'callout',
    keywords: ['nota', 'callout', 'highlight'],
  },
  {
    id: 'divider',
    label: 'Divisor',
    description: 'Línea divisoria',
    icon: 'Minus',
    type: 'divider',
    keywords: ['divisor', 'hr', 'line'],
  },
  {
    id: 'code',
    label: 'Código',
    description: 'Bloque de código con resaltado',
    icon: 'Code',
    type: 'code',
    keywords: ['código', 'code', 'programming', 'snippet'],
  },
  {
    id: 'table',
    label: 'Tabla',
    description: 'Tabla con filas y columnas',
    icon: 'Table',
    type: 'table',
    keywords: ['tabla', 'table', 'grid', 'spreadsheet'],
  },
  {
    id: 'kanban',
    label: 'Kanban',
    description: 'Tablero Kanban',
    icon: 'Columns',
    type: 'kanban',
    keywords: ['kanban', 'tablero', 'board', 'tasks'],
  },
  {
    id: 'image',
    label: 'Imagen',
    description: 'Insertar imagen',
    icon: 'Image',
    type: 'image',
    keywords: ['imagen', 'image', 'foto', 'picture'],
  },
];

export const CODE_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
];
