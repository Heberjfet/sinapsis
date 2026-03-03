import { useRef, useEffect, useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Check, Square, Quote, Minus, Code, Image, Copy, Plus, Trash2 } from 'lucide-react';
import { Block as BlockType, CODE_LANGUAGES } from '../../types/editor';
import { useEditorStore } from '../../store/editorStore';
import { v4 as uuidv4 } from 'uuid';

interface BlockProps {
  block: BlockType;
  pageId: string;
  isActive: boolean;
  onFocus: () => void;
  onSlashMenu: (show: boolean) => void;
  onNewBlock: (newBlockId: string) => void;
}

export const Block = ({ block, pageId, isActive, onFocus, onSlashMenu, onNewBlock }: BlockProps) => {
  const { updateBlock, updateBlockType, deleteBlock, addBlock, toggleTodo, updateBlockProperties } = useEditorStore();
  const contentRef = useRef<HTMLDivElement>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (contentRef.current && block.type !== 'code' && block.type !== 'table' && block.type !== 'kanban') {
      contentRef.current.innerText = block.content;
    }
  }, []);

  // Sync contentEditable when block content/type changes externally (e.g. slash menu conversion)
  useEffect(() => {
    if (contentRef.current && block.type !== 'code' && block.type !== 'table' && block.type !== 'kanban') {
      if (contentRef.current.innerText !== block.content) {
        contentRef.current.innerText = block.content;
      }
    }
  }, [block.content, block.type]);

  // Re-focus the block when type changes (e.g. after slash menu conversion)
  useEffect(() => {
    if (!isActive) return;

    // Use requestAnimationFrame to let the DOM re-render with the new type first
    requestAnimationFrame(() => {
      if (contentRef.current && block.type !== 'code' && block.type !== 'table' && block.type !== 'kanban') {
        contentRef.current.focus();
      }
    });
  }, [isActive, block.type]);

  const handleInput = () => {
    if (contentRef.current && block.type !== 'code' && block.type !== 'table' && block.type !== 'kanban') {
      const text = contentRef.current.innerText;

      // Check for slash command
      if (text === '/') {
        setShowSlashMenu(true);
        onSlashMenu(true);
      } else {
        setShowSlashMenu(false);
        onSlashMenu(false);
      }

      // Check for markdown shortcuts
      if (text === '# ' || text === '#') {
        updateBlockType(pageId, block.id, 'h1');
        if (contentRef.current) contentRef.current.innerText = '';
      } else if (text === '## ' || text === '##') {
        updateBlockType(pageId, block.id, 'h2');
        if (contentRef.current) contentRef.current.innerText = '';
      } else if (text === '### ' || text === '###') {
        updateBlockType(pageId, block.id, 'h3');
        if (contentRef.current) contentRef.current.innerText = '';
      } else if (text === '- ' || text === '-') {
        updateBlockType(pageId, block.id, 'bullet-list');
        if (contentRef.current) contentRef.current.innerText = '';
      } else if (text === '[] ' || text === '[]') {
        updateBlockType(pageId, block.id, 'todo');
        if (contentRef.current) contentRef.current.innerText = '';
      } else if (text === '> ' || text === '>') {
        updateBlockType(pageId, block.id, 'quote');
        if (contentRef.current) contentRef.current.innerText = '';
      } else if (text === '```') {
        updateBlockType(pageId, block.id, 'code');
        if (contentRef.current) contentRef.current.innerText = '';
      } else if (text === '---') {
        updateBlockType(pageId, block.id, 'divider');
        if (contentRef.current) contentRef.current.innerText = '';
      }

      updateBlock(pageId, block.id, text);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && block.type !== 'code' && block.type !== 'table' && block.type !== 'kanban') {
      e.preventDefault();
      const newBlockId = addBlock(pageId, block.id);
      onNewBlock(newBlockId);
    } else if (e.key === 'Backspace' && block.content === '' && block.type !== 'code' && block.type !== 'table' && block.type !== 'kanban') {
      e.preventDefault();
      deleteBlock(pageId, block.id);
    }
  };

  const handleClick = () => {
    onFocus();
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTodo(pageId, block.id);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateBlock(pageId, block.id, e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateBlockProperties(pageId, block.id, { language: e.target.value });
  };

  const renderContent = () => {
    if (block.type === 'divider') {
      return <hr className="border-t border-border/50 my-2" />;
    }

    if (block.type === 'todo') {
      return (
        <div className="flex items-start gap-2">
          <button
            onClick={handleCheckboxClick}
            className="mt-1 flex-shrink-0 transition-colors"
          >
            {block.properties?.checked ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Square className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <div
            ref={contentRef}
            contentEditable
            className={`flex-1 outline-none block-editor ${
              block.properties?.checked ? 'line-through text-muted-foreground' : ''
            }`}
            data-placeholder="Tarea..."
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
          />
        </div>
      );
    }

    if (block.type === 'quote') {
      return (
        <div className="flex">
          <Quote className="w-4 h-4 text-secondary mr-2 mt-1 flex-shrink-0" />
          <div
            ref={contentRef}
            contentEditable
            className="flex-1 outline-none block-editor italic"
            data-placeholder="Cita..."
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
          />
        </div>
      );
    }

    if (block.type === 'callout') {
      return (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/50">
          <div
            ref={contentRef}
            contentEditable
            className="flex-1 outline-none block-editor"
            data-placeholder="Nota..."
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
          />
        </div>
      );
    }

    if (block.type === 'bullet-list') {
      return (
        <div className="flex items-start">
          <span className="mr-2 mt-1">•</span>
          <div
            ref={contentRef}
            contentEditable
            className="flex-1 outline-none block-editor"
            data-placeholder="Elemento de lista..."
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
          />
        </div>
      );
    }

    if (block.type === 'numbered-list') {
      return (
        <div className="flex items-start">
          <span className="mr-2 mt-1">1.</span>
          <div
            ref={contentRef}
            contentEditable
            className="flex-1 outline-none block-editor"
            data-placeholder="Elemento numerado..."
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
          />
        </div>
      );
    }

    if (block.type === 'code') {
      return (
        <div className="rounded-xl overflow-hidden border border-border/50 w-full">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-muted/50 border-b border-border/30">
            <select
              value={block.properties?.language || 'javascript'}
              onChange={handleLanguageChange}
              className="bg-transparent text-sm text-muted-foreground outline-none"
            >
              {CODE_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => navigator.clipboard.writeText(block.content)}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <textarea
            value={block.content}
            onChange={handleCodeChange}
            placeholder="Escribe tu código aquí..."
            className="w-full px-3 sm:px-4 py-3 bg-card text-xs sm:text-sm font-mono text-foreground outline-none resize-none overflow-x-auto"
            rows={6}
            autoFocus={isActive}
          />
        </div>
      );
    }

    if (block.type === 'table') {
      return (
        <div className="rounded-xl overflow-hidden border border-border/50 w-full">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-foreground">A</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-foreground">B</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-foreground">C</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2].map((row) => (
                  <tr key={row} className="border-t border-border/30">
                    <td className="px-4 py-2 text-sm text-foreground">Cell {row + 1}-1</td>
                    <td className="px-4 py-2 text-sm text-foreground">Cell {row + 1}-2</td>
                    <td className="px-4 py-2 text-sm text-foreground">Cell {row + 1}-3</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (block.type === 'kanban') {
      return (
        <div className="flex gap-3 overflow-x-auto py-2 -mx-1 px-1">
          {['Por hacer', 'En progreso', 'Hecho'].map((column, colIndex) => (
            <div
              key={colIndex}
              className="flex-shrink-0 w-48 sm:w-56 md:w-64 rounded-xl bg-muted/30 p-3"
            >
              <h4 className="text-sm font-medium text-foreground mb-3">{column}</h4>
              <div className="space-y-2">
                {colIndex === 0 && (
                  <div className="p-2 bg-card rounded-lg border border-border/50 text-sm text-foreground">
                    Tarea de ejemplo
                  </div>
                )}
                <button className="w-full flex items-center gap-2 p-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Plus className="w-4 h-4" />
                  Añadir tarjeta
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (block.type === 'image') {
      return (
        <div className="rounded-xl overflow-hidden border border-border/50 w-full">
          {block.properties?.url ? (
            <img
              src={block.properties.url}
              alt="Imagen"
              className="w-full h-40 sm:h-48 object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-40 sm:h-48 bg-muted/30">
              <Image className="w-12 h-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Arrastra una imagen o</p>
              <label className="px-4 py-2 bg-primary text-foreground text-sm rounded-lg cursor-pointer hover:bg-primary/80 transition-colors">
                Seleccionar archivo
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        ref={contentRef}
        contentEditable
        className="outline-none block-editor"
        data-placeholder="Escribe algo..."
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      />
    );
  };

  const getTextClass = () => {
    switch (block.type) {
      case 'h1':
        return 'text-3xl font-bold mb-3 mt-4 text-foreground';
      case 'h2':
        return 'text-2xl font-semibold mb-2 mt-3 text-foreground';
      case 'h3':
        return 'text-xl font-medium mb-1.5 mt-2 text-foreground';
      case 'code':
        return '';
      case 'table':
        return '';
      case 'kanban':
        return '';
      case 'image':
        return '';
      case 'text':
      default:
        return 'text-base text-foreground/90 leading-relaxed';
    }
  };

  const isComplexBlock = ['code', 'table', 'kanban', 'image'].includes(block.type);

  if (block.type === 'divider') {
    return (
      <div ref={setNodeRef} style={style} className="block-wrapper group relative pl-6 sm:pl-8">
        <div className="drag-handle absolute left-0 top-1/2 -translate-y-1/2 cursor-grab" {...attributes} {...listeners}>
          <GripVertical className="w-4 h-4" />
        </div>
        {renderContent()}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`block-wrapper group relative flex items-start py-0.5 w-full min-w-0 ${
        isDragging ? 'z-50' : ''
      } ${isComplexBlock ? 'py-2' : ''}`}
    >
      {!isComplexBlock && (
        <div
          className="drag-handle absolute -left-6 sm:-left-8 top-1 cursor-grab opacity-0 group-hover:opacity-50 transition-opacity"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      <motion.div
        className={`flex-1 min-w-0 ${getTextClass()}`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};
