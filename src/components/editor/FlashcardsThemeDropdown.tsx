import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, ChevronDown, Trash2 } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { DeleteThemeConfirm } from '../panels/DeleteThemeConfirm';

interface FlashcardsThemeDropdownProps {
  isActive: boolean;
  onNavigate: () => void;
}

export const FlashcardsThemeDropdown = ({
  isActive,
  onNavigate,
}: FlashcardsThemeDropdownProps) => {
  const {
    subjects,
    flashcards,
    setActiveView,
    setCurrentFlashcardTheme,
    setShowCreateThemeModal,
    deleteSubject,
  } = useEditorStore();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleThemeClick = (themeId: string) => {
    setCurrentFlashcardTheme(themeId);
    setActiveView('flashcards');
    setIsOpen(false);
  };

  const handleCreateTheme = () => {
    setShowCreateThemeModal(true);
    setIsOpen(false);
  };

  const handleDeleteTheme = (themeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm(themeId);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      deleteSubject(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleMainButtonClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      onNavigate();
    }
  };

  const getThemeCardsCount = (themeId: string) => {
    return flashcards.filter((card) => card.subjectId === themeId).length;
  };

  const getThemeById = (themeId: string) => {
    return subjects.find((s) => s.id === themeId);
  };

  return (
    <>
      <div className="relative">
        <motion.button
          onClick={handleMainButtonClick}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            isActive ? 'bg-primary/30 text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
          whileHover={{ scale: 1.02, x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">Flashcards</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="ml-auto"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-1 bg-muted rounded-lg border border-border/50 shadow-lg z-50 overflow-hidden"
            >
              <div className="p-1">
                {/* Create Theme Option */}
                <motion.button
                  onClick={handleCreateTheme}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-card transition-colors"
                  whileHover={{ x: 2 }}
                >
                  <Plus className="w-4 h-4 text-primary" />
                  <span className="font-medium">Agregar un tema nuevo</span>
                </motion.button>

                <div className="my-1 border-t border-border/30" />

                {/* Themes List */}
                {subjects.length === 0 ? (
                  <div className="px-3 py-3 text-center text-xs text-muted-foreground">
                    No hay temas creados
                  </div>
                ) : (
                  subjects.map((theme) => (
                    <div
                      key={theme.id}
                      className="flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-card transition-colors group"
                    >
                      <motion.button
                        onClick={() => handleThemeClick(theme.id)}
                        className="flex-1 flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-foreground text-left"
                        whileHover={{ x: 2 }}
                      >
                        <span className="text-base">{theme.icon}</span>
                        <span className="flex-1">{theme.name}</span>
                        <span className="text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded">
                          {getThemeCardsCount(theme.id)}
                        </span>
                      </motion.button>

                      {/* Delete Button */}
                      <motion.button
                        onClick={(e) => handleDeleteTheme(theme.id, e)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/20 transition-colors opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Eliminar tema"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <DeleteThemeConfirm
          isOpen={true}
          themeName={getThemeById(deleteConfirm)?.name || ''}
          cardCount={getThemeCardsCount(deleteConfirm)}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </>
  );
};
