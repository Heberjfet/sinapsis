import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  MessageSquare,
  Minus,
  Code,
  Table,
  Columns,
  Image,
} from 'lucide-react';
import { SLASH_COMMANDS, BlockType } from '../../types/editor';
import { useEditorStore } from '../../store/editorStore';

interface SlashMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  MessageSquare,
  Minus,
  Code,
  Table,
  Columns,
  Image,
};

export const SlashMenu = ({ isOpen, position, onClose }: SlashMenuProps) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const { currentPageId, updateBlockType, addBlock } = useEditorStore();

  const filteredCommands = SLASH_COMMANDS.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        selectCommand(filteredCommands[selectedIndex].type);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  const selectCommand = (type: BlockType) => {
    if (!currentPageId) return;

    const newBlockId = addBlock(currentPageId);
    updateBlockType(currentPageId, newBlockId, type);

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className="fixed z-50 w-72 glass shadow-lg rounded-xl border border-border/50 overflow-hidden"
          style={{
            left: Math.min(position.x, window.innerWidth - 300),
            top: Math.min(position.y, window.innerHeight - 400),
          }}
        >
          <div className="p-2 border-b border-border/30">
            <input
              type="text"
              placeholder="Buscar bloques..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
              autoFocus
            />
          </div>

          <div className="max-h-64 overflow-y-auto p-1">
            {filteredCommands.map((cmd, index) => {
              const Icon = iconMap[cmd.icon] || Type;

              return (
                <motion.button
                  key={cmd.id}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    index === selectedIndex
                      ? 'bg-primary/30'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => selectCommand(cmd.type)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-pastel-lavender">
                    <Icon className="w-4 h-4 text-foreground/70" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">
                      {cmd.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {cmd.description}
                    </div>
                  </div>
                </motion.button>
              );
            })}

            {filteredCommands.length === 0 && (
              <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                No se encontraron comandos
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
