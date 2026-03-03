import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  Plus,
  Sparkles,
  LayoutDashboard,
  Settings,
  BookOpen,
  Timer,
  Music,
  Moon,
  Sun,
  Command,
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export const CommandPalette = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    pages,
    setCurrentPage,
    setActiveView,
    createPage,
    toggleRightPanel,
    setRightPanelTab,
  } = useEditorStore();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    {
      id: 'new-page',
      label: 'Nueva página',
      description: 'Crear una nueva nota',
      icon: Plus,
      action: () => createPage(),
    },
    {
      id: 'notes',
      label: 'Ir a Notas',
      description: 'Ver todas las notas',
      icon: FileText,
      action: () => setActiveView('notes'),
    },
    {
      id: 'flashcards',
      label: 'Ir a Flashcards',
      description: 'Repasar tarjetas de memoria',
      icon: BookOpen,
      action: () => setActiveView('flashcards'),
    },
    {
      id: 'dashboard',
      label: 'Ir a Dashboard',
      description: 'Ver estadísticas de estudio',
      icon: LayoutDashboard,
      action: () => setActiveView('dashboard'),
    },
    {
      id: 'settings',
      label: 'Ir a Configuración',
      description: 'Ajustes de la aplicación',
      icon: Settings,
      action: () => setActiveView('settings'),
    },
    {
      id: 'ai-chat',
      label: 'Abrir chat IA',
      description: 'Chatear con inteligencia artificial',
      icon: Sparkles,
      action: () => {
        setRightPanelTab('ai');
      },
    },
    {
      id: 'pomodoro',
      label: 'Abrir Pomodoro',
      description: 'Iniciar temporizador de concentración',
      icon: Timer,
      action: () => {
        setRightPanelTab('pomodoro');
      },
    },
    {
      id: 'music',
      label: 'Abrir Música',
      description: 'Conectar con Spotify',
      icon: Music,
      action: () => {
        setRightPanelTab('music');
      },
    },
    ...pages.map((page) => ({
      id: `page-${page.id}`,
      label: page.title || 'Sin título',
      description: `Ir a: ${page.title}`,
      icon: FileText,
      action: () => setCurrentPage(page.id),
    })),
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }

      if (!commandPaletteOpen) return;

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
        filteredCommands[selectedIndex]?.action();
        setCommandPaletteOpen(false);
      } else if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, filteredCommands, selectedIndex, setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl glass shadow-2xl rounded-2xl border border-border/50 overflow-hidden z-50"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar comandos, notas..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
              <kbd className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {filteredCommands.map((cmd, index) => {
                const Icon = cmd.icon;
                return (
                  <motion.button
                    key={cmd.id}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${index === selectedIndex
                        ? 'bg-primary/30'
                        : 'hover:bg-muted'
                      }`}
                    onClick={() => {
                      cmd.action();
                      setCommandPaletteOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-pastel-lavender">
                      <Icon className="w-4 h-4 text-foreground/70" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm font-medium text-foreground">
                        {cmd.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {cmd.description}
                      </div>
                    </div>
                    {index === selectedIndex && (
                      <kbd className="px-2 py-0.5 text-xs bg-muted rounded text-muted-foreground">
                        ↵
                      </kbd>
                    )}
                  </motion.button>
                );
              })}

              {filteredCommands.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No se encontraron resultados
                </div>
              )}
            </div>

            <div className="px-4 py-2 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">↑↓</kbd> Navegar
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd> Seleccionar
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Command className="w-3 h-3" /> K para abrir
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
