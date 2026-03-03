import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Menu, Moon, Sun } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { Block } from './Block';
import { SlashMenu } from './SlashMenu';

export const Editor = () => {
  const {
    pages,
    currentPageId,
    updatePageTitle,
    reorderBlocks,
    toggleSidebar,
    sidebarOpen,
    activeView,
  } = useEditorStore();

  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [darkMode, setDarkMode] = useState(false);

  const currentPage = pages.find((p) => p.id === currentPageId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && currentPageId) {
      reorderBlocks(currentPageId, active.id as string, over.id as string);
    }
  };

  const handleBlockFocus = useCallback((blockId: string) => {
    setActiveBlockId(blockId);
  }, []);

  const handleNewBlock = useCallback((newBlockId: string) => {
    setActiveBlockId(newBlockId);
  }, []);

  const handleSlashMenu = useCallback((show: boolean, position?: { x: number; y: number }) => {
    setSlashMenuOpen(show);
    if (position) {
      setSlashMenuPosition(position);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  // Don't render editor if not in notes view
  if (activeView !== 'notes') {
    return null;
  }

  if (!currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Selecciona una página
          </h2>
          <p className="text-muted-foreground">
            Elige una página del panel lateral para comenzar a editar
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <motion.header
        className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/30 shrink-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentPage.icon || '📄'}</span>
            <input
              type="text"
              value={currentPage.title}
              onChange={(e) => updatePageTitle(currentPage.id, e.target.value)}
              className="text-lg font-medium bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-full max-w-xs sm:max-w-sm md:max-w-md"
              placeholder="Sin título"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </motion.header>

      {/* Editor content */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={currentPage.blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence mode="popLayout">
                {currentPage.blocks.map((block, index) => (
                  <Block
                    key={block.id}
                    block={block}
                    pageId={currentPage.id}
                    isActive={activeBlockId === block.id}
                    onFocus={() => handleBlockFocus(block.id)}
                    onNewBlock={handleNewBlock}
                    onSlashMenu={(show) => handleSlashMenu(show, {
                      x: 100,
                      y: 100 + index * 40,
                    })}
                  />
                ))}
              </AnimatePresence>
            </SortableContext>
          </DndContext>

          {/* Empty state */}
          {currentPage.blocks.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground mb-4">
                Esta página está vacía
              </p>
              <p className="text-sm text-muted-foreground">
                Comienza a escribir o presiona "/" para ver los comandos
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Slash Menu */}
      <SlashMenu
        isOpen={slashMenuOpen}
        position={slashMenuPosition}
        onClose={() => setSlashMenuOpen(false)}
        activeBlockId={activeBlockId}
        pageId={currentPageId}
      />

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-2 border-t border-border/30 text-center shrink-0">
        <p className="text-xs text-muted-foreground truncate">
          Presiona "/" para comandos • Ctrl+K para búsqueda
        </p>
      </footer>
    </div>
  );
};
