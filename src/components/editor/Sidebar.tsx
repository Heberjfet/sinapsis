import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ChevronRight,
  ChevronDown,
  FileText,
  Trash2,
  MoreHorizontal,
  LayoutDashboard,
  BookOpen,
  Settings,
  Sparkles,
  Timer,
  Music,
  Command,
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { Page } from '../../types/editor';
import { useState } from 'react';

const PageTreeItem = ({
  page,
  depth = 0,
}: {
  page: Page;
  depth?: number;
}) => {
  const { currentPageId, setCurrentPage, deletePage } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const isActive = currentPageId === page.id;

  const childPages = useEditorStore.getState().pages.filter((p) => p.parentId === page.id);
  const hasChildren = childPages.length > 0;

  return (
    <div className="select-none">
      <motion.div
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200 group ${isActive
          ? 'bg-primary/30'
          : 'hover:bg-muted'
          }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => setCurrentPage(page.id)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className={`p-0.5 rounded hover:bg-muted transition-colors ${hasChildren ? 'visible' : 'invisible'
            }`}
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>

        <span className="text-sm mr-1">{page.icon || '📄'}</span>

        <span className="flex-1 text-sm truncate text-foreground/80 group-hover:text-foreground">
          {page.title || 'Sin título'}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            deletePage(page.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 transition-all"
        >
          <Trash2 className="w-3 h-3 text-destructive" />
        </button>
      </motion.div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {childPages.map((child) => (
              <PageTreeItem key={child.id} page={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Sidebar = () => {
  const {
    pages,
    sidebarOpen,
    toggleSidebar,
    createPage,
    activeView,
    setActiveView,
    toggleRightPanel,
    setRightPanelTab,
    setCommandPaletteOpen,
  } = useEditorStore();

  const rootPages = pages.filter((p) => !p.parentId);

  const handleNewPage = () => {
    createPage();
  };

  const navItems = [
    { id: 'notes' as const, icon: FileText, label: 'Notas' },
    { id: 'flashcards' as const, icon: BookOpen, label: 'Flashcards' },
    { id: 'dashboard' as const, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'settings' as const, icon: Settings, label: 'Ajustes' },
  ];

  const toolItems = [
    { id: 'ai' as const, icon: Sparkles, label: 'IA', tab: 'ai' as const },
    { id: 'pomodoro' as const, icon: Timer, label: 'Pomodoro', tab: 'pomodoro' as const },
    { id: 'music' as const, icon: Music, label: 'Música', tab: 'music' as const },
  ];

  return (
    <AnimatePresence mode="wait">
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="h-full bg-pastel-lavender/30 border-r border-border/50 flex flex-col overflow-hidden"
        >
          {/* Command Palette Trigger */}
          <div className="p-3 border-b border-border/30">
            <motion.button
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm text-muted-foreground"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Command className="w-4 h-4" />
              <span className="flex-1 text-left">Buscar...</span>
              <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">⌘K</kbd>
            </motion.button>
          </div>

          {/* Main Navigation */}
          <div className="p-2 border-b border-border/30">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                    ? 'bg-primary/30 text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Tools */}
          <div className="p-2 border-b border-border/30">
            <div className="px-3 py-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Herramientas
              </span>
            </div>
            {toolItems.map((item) => {
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    useEditorStore.setState((state) => {
                      const isSameTab = state.rightPanelTab === item.tab;
                      if (state.rightPanelOpen && isSameTab) {
                        // Panel is open on the same tab - close it
                        return { rightPanelOpen: false };
                      } else {
                        // Panel is closed or on a different tab - open with new tab
                        return { rightPanelTab: item.tab, rightPanelOpen: true };
                      }
                    });
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Pages Section */}
          {activeView === 'notes' && (
            <div className="flex-1 overflow-y-auto p-2">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Páginas
                </span>
                <button
                  onClick={handleNewPage}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {rootPages.map((page) => (
                <PageTreeItem key={page.id} page={page} />
              ))}

              {rootPages.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No hay páginas</p>
                  <button
                    onClick={handleNewPage}
                    className="text-sm text-primary hover:underline mt-1"
                  >
                    Crear una página
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="p-3 border-t border-border/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Sinapsis v1.0
            </div>
          </div>
        </motion.aside>
      )}

      {!sidebarOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
          className="absolute left-3 top-3 p-2 rounded-xl bg-card shadow-sm border border-border/50 hover:bg-muted transition-colors z-10"
        >
          <FileText className="w-5 h-5 text-foreground" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
